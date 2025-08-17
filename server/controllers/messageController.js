const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");
const mongoose = require("mongoose");

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
  console.log("Sending message:", req.body);
  try {
    const senderId = req.user._id;
    const { receiver, chatId, message: text, type = "text", replyTo } = req.body; // added replyTo
    console.log(`Sending message from ${senderId} to ${receiver}:`, text);

    if (!receiver || !text) {
      return res.status(400).json({ message: "Receiver and message text are required" });
    }

    // Find or create chat
    console.log("Finding or creating chat...");
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      chat = await Chat.findOne({
        members: { $all: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(receiver)] },
      });
      if (!chat) {
        chat = await Chat.create({
          members: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(receiver)],
        });
      }
    }

    let msg;

    if (replyTo) {
      // Sending a reply to an existing message
      const parentMsg = await Message.findById(replyTo);
      if (!parentMsg) return res.status(404).json({ message: "Parent message not found" });

      const reply = {
        sender: senderId,
        text,
        type,
        delivered: false,
        seen: false,
      };

      parentMsg.replies.push(reply);
      await parentMsg.save();

      msg = parentMsg.replies[parentMsg.replies.length - 1]; // return the reply
      console.log("Reply created:", msg);
    } else {
      // Sending a normal message
      msg = await Message.create({
        chatId: chat._id,
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(receiver),
        text,
        type,
        delivered: false,
        seen: false,
      });
      console.log("Message created:", msg);

      chat.lastMessage = {
        text,
        type,
        sender: new mongoose.Types.ObjectId(senderId),
        createdAt: msg.createdAt,
        seenBy: [new mongoose.Types.ObjectId(senderId)],
      };
      await chat.save();
    }

    // Socket delivery
    const io = req.app.get("io");
    const online = req.app.get("onlineUsers"); // Map<userId,socketId>
    const receiverSocket = online.get(String(receiver));

    if (receiverSocket) {
      io.to(receiverSocket).emit("chat:new_message", {
        chatId: chat._id,
        message: msg,
      });

      if (!replyTo) {
        msg.delivered = true;
        msg.deliveredAt = new Date();
        await msg.save();
      }
    }

    // Ack to sender
    const senderSocket = online.get(String(senderId));
    if (senderSocket) {
      io.to(senderSocket).emit("chat:ack_message", {
        chatId: chat._id,
        messageId: msg._id || null,
        delivered: msg.delivered || true,
        deliveredAt: msg.deliveredAt || new Date(),
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    console.log("Error sending message:", err);
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
    const { messageId, replyId } = req.params;
    const { userId, text } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Not found" });

    if (replyId) {
      const reply = msg.replies.id(replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });
      if (String(reply.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });

      reply.text = text;
      await msg.save();
      res.json(reply);
    } else {
      if (String(msg.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });
      msg.text = text;
      await msg.save();
      res.json(msg);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { messageId, replyId } = req.params;
    const { userId } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Not found" });

    if (replyId) {
      const reply = msg.replies.id(replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });
      if (String(reply.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });

      reply.remove();
      await msg.save();
    } else {
      if (String(msg.sender) !== String(userId)) return res.status(403).json({ message: "Not allowed" });
      await msg.deleteOne();
    }

    const io = req.app.get("io");
    io.to(String(msg.chatId)).emit("chat:delete_message", { messageId, replyId });
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
