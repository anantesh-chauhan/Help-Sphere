const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");

/* helpers */
function incUnread(chat, userId) {
  const row = chat.unread.find((u) => String(u.user) === String(userId));
  if (row) row.count += 1;
  else chat.unread.push({ user: userId, count: 1 });
}
function zeroUnread(chat, userId) {
  const row = chat.unread.find((u) => String(u.user) === String(userId));
  if (row) row.count = 0;
}

async function sendMessage(req, res, next) {
  console.log('Send messages called with body : ' )
  try {
    const senderId = req.user._id;
    const { receiver, chatId, message: text, type = "text" } = req.body;

    if (!receiver || !text) {
      return res.status(400).json({ message: "Receiver and message text are required" });
    }

    // If chatId not provided, find or create chat
    let chat = null;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      // Find existing chat between users
      chat = await Chat.findOne({
        participants: { $all: [senderId, receiver] },
      });
      if (!chat) {
        chat = await Chat.create({
          participants: [senderId, receiver],
        });
      }
    }

    const msg = await Message.create({
      chatId: chat._id,
      sender: senderId,
      receiver,
      text,
      type,
      delivered: false,
      seen: false,
    });

    chat.lastMessage = {
      text,
      type,
      sender: senderId,
      createdAt: msg.createdAt,
      seenBy: [senderId],
    };
    await chat.save();

    // Socket delivery
    const io = req.app.get("io");
    const online = req.app.get("onlineUsers"); // Map<userId,socketId>
    const receiverSocket = online.get(String(receiver));

    if (receiverSocket) {
      io.to(receiverSocket).emit("chat:new_message", {
        chatId: chat._id,
        message: {
          _id: msg._id,
          chatId: chat._id,
          sender: senderId,
          receiver,
          text,
          type,
          delivered: true,
          deliveredAt: new Date().toISOString(),
          seen: false,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        },
      });
      msg.delivered = true;
      msg.deliveredAt = new Date();
      await msg.save();
    }

    const senderSocket = online.get(String(senderId));
    if (senderSocket) {
      io.to(senderSocket).emit("chat:ack_message", {
        chatId: chat._id,
        messageId: msg._id,
        delivered: msg.delivered,
        deliveredAt: msg.deliveredAt,
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

async function markSeen(req, res, next) {
  try {
    const { chatId, userId, friendId } = req.body;
    if (!chatId || !userId || !friendId)
      return res.status(400).json({ message: "chatId, userId, friendId required" });

    await Message.updateMany(
      { chatId, receiver: userId, sender: friendId, seen: false },
      { $set: { seen: true, seenAt: new Date() } }
    );

    const chat = await Chat.findById(chatId);
    chat.lastMessage.seenBy = Array.from(new Set([...(chat.lastMessage?.seenBy || []), userId]));
    zeroUnread(chat, userId);
    await chat.save();

    const io = req.app.get("io");
    const online = req.app.get("onlineUsers");
    const friendSocket = online.get(String(friendId));
    if (friendSocket) {
      io.to(friendSocket).emit("chat:seen", { chatId, seenBy: userId, at: new Date().toISOString() });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function editMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const { userId, text } = req.body;
    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Not found" });
    if (String(msg.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });

    msg.text = text;
    await msg.save();

    const io = req.app.get("io");
    io.to(String(msg.chatId)).emit("chat:edit_message", { messageId, text });
    res.json(msg);
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Not found" });
    if (String(msg.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });

    await msg.deleteOne();

    const io = req.app.get("io");
    io.to(String(msg.chatId)).emit("chat:delete_message", { messageId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMessage,
  getMessages,
  markSeen,
  editMessage,
  deleteMessage,
};
