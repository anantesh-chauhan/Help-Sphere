const Chat = require("../models/Chat.js");

/** Ensure unread entries exist for all members */
function ensureUnreadEntries(chat) {
  chat.members.forEach((m) => {
    if (!chat.unread.some((u) => String(u.user) === String(m))) {
      chat.unread.push({ user: m, count: 0 });
    }
  });
}

async function openChat(req, res, next) {
  try {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) return res.status(400).json({ message: "userId and friendId required" });

    let chat = await Chat.findOne({ members: { $all: [userId, friendId], $size: 2 } });
    if (!chat) {
      chat = new Chat({
        members: [userId, friendId],
        unread: [
          { user: userId, count: 0 },
          { user: friendId, count: 0 },
        ],
      });
      await chat.save();
    } else {
      ensureUnreadEntries(chat);
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    next(err);
  }
}

async function getUserChats(req, res, next) {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ members: userId })
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 })
      .lean();
    res.json(chats);
  } catch (err) {
    next(err);
  }
}

module.exports = { openChat, getUserChats };
