const User = require('../models/User.js');
const FriendRequest = require('../models/FriendRequest.js');

// controllers/friendController.js
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email avatar donations helpRequests');
    res.json(users); // <-- must send array
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.searchUsers = async (req, res) => {
  const q = (req.query.q || '').trim();
  const regex = new RegExp(q, 'i');
  const users = await User.find({ name: regex, _id: { $ne: req.user.id } }, 'name email avatar donations helpRequests');
  res.json(users);
};

exports.sendRequest = async (req, res) => {
  const { toUserId } = req.body;
  if (toUserId === req.user.id) return res.status(400).json({ message: 'Cannot friend yourself' });

  const exists = await FriendRequest.findOne({ from: req.user.id, to: toUserId });
  const reverse = await FriendRequest.findOne({ from: toUserId, to: req.user.id });
  if (exists || reverse) return res.status(400).json({ message: 'Request already exists' });

  await FriendRequest.create({ from: req.user.id, to: toUserId });
  res.json({ message: 'Friend request sent' });
};

exports.getIncoming = async (req, res) => {
  const incoming = await FriendRequest.find({ to: req.user.id, status: 'pending' })
    .populate('from', '_id name avatar');
  res.json(incoming);
};

exports.getOutgoing = async (req, res) => {
  const outgoing = await FriendRequest.find({ from: req.user.id, status: 'pending' })
    .populate('to', '_id name avatar');
  res.json(outgoing);
};

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.params;
  const fr = await FriendRequest.findOne({ _id: requestId, to: req.user.id, status: 'pending' });
  if (!fr) return res.status(404).json({ message: 'Request not found' });

  fr.status = 'accepted';
  await fr.save();

  await User.findByIdAndUpdate(fr.from, { $addToSet: { friends: fr.to } });
  await User.findByIdAndUpdate(fr.to, { $addToSet: { friends: fr.from } });

  res.json({ message: 'Friend request accepted' });
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const fr = await FriendRequest.findOne({ _id: requestId, to: req.user.id, status: 'pending' });
  if (!fr) return res.status(404).json({ message: 'Request not found' });
  fr.status = 'rejected';
  await fr.save();
  res.json({ message: 'Friend request rejected' });
};

exports.listFriends = async (req, res) => {
  const me = await User.findById(req.user.id).populate('friends', '_id name avatar');
  res.json(me.friends || []);
};

exports.unfriend = async (req, res) => {
  const { friendId } = req.params;
  await User.findByIdAndUpdate(req.user.id, { $pull: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $pull: { friends: req.user.id } });
  res.json({ message: 'Unfriended' });
};
