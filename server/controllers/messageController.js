import Message from '../models/Message.js';
import User from '../models/User.js';

export const getThread = async (req, res) => {
  const { userId } = req.params;
  // Ensure you are friends
  const me = await User.findById(req.user.id);
  const isFriend = me.friends.map(String).includes(userId);
  if (!isFriend) return res.status(403).json({ message: 'Not friends' });

  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: userId },
      { sender: userId, receiver: req.user.id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { toUserId, body } = req.body;
  if (!body?.trim()) return res.status(400).json({ message: 'Empty message' });

  const me = await User.findById(req.user.id);
  const isFriend = me.friends.map(String).includes(toUserId);
  if (!isFriend) return res.status(403).json({ message: 'Not friends' });

  const msg = await Message.create({
    sender: req.user.id,
    receiver: toUserId,
    body
  });

  // socket emission happens in server.js via io.to(userRoom).emit(...)
  res.json(msg);
};

export const markRead = async (req, res) => {
  const { userId } = req.params; // other user
  await Message.updateMany(
    { sender: userId, receiver: req.user.id, readAt: { $exists: false } },
    { $set: { readAt: new Date() } }
  );
  res.json({ message: 'Marked as read' });
};
