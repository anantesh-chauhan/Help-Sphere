const User = require('../models/User.js');
const FriendRequest = require('../models/FriendRequest.js');
const Donation = require('../models/Donation.js');
const HelpOffer = require('../models/HelpOffer.js');

exports.listUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch all users except current
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      'name email avatar friends'
    ).lean();

    // Get friend requests involving current user
    const requests = await FriendRequest.find({
      $or: [
        { from: currentUserId },
        { to: currentUserId }
      ]
    }).lean();

    // Donation counts
    const donationCounts = await Donation.aggregate([
      { $group: { _id: "$donorName", total: { $sum: 1 } } }
    ]);

    // Help offer counts
    const helpOfferCounts = await HelpOffer.aggregate([
      { $group: { _id: "$helper", total: { $sum: 1 } } }
    ]);

    const donationMap = {};
    donationCounts.forEach(d => {
      donationMap[d._id] = d.total;
    });

    const helpOfferMap = {};
    helpOfferCounts.forEach(h => {
      helpOfferMap[h._id?.toString()] = h.total;
    });

    const usersWithStatus = users.map(user => {
      let friendStatus = 'not_friend';

      const isFriend = user.friends?.some(f => f?.toString() === currentUserId);
      const isPending = requests.some(r => {
        const fromId = r.from ? r.from.toString() : null;
        const toId = r.to ? r.to.toString() : null;
        return (
          (fromId === currentUserId && toId === user._id.toString()) ||
          (toId === currentUserId && fromId === user._id.toString())
        );
      });

      if (isFriend) {
        friendStatus = 'friend';
      } else if (isPending) {
        friendStatus = 'pending';
      }

      return {
        ...user,
        friendStatus,
        donationsCount: donationMap[user.name] || 0,
        helpOffersCount: helpOfferMap[user._id?.toString()] || 0
      };
    });

    res.json(usersWithStatus);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const regex = new RegExp(q, 'i');
    const currentUserId = req.user.id;

    const users = await User.find(
      { name: regex, _id: { $ne: currentUserId } },
      'name email avatar friends'
    ).lean();

    const requests = await FriendRequest.find({
      $or: [
        { from: currentUserId },
        { to: currentUserId }
      ]
    }).lean();

    const donationCounts = await Donation.aggregate([
      { $group: { _id: "$donorName", total: { $sum: 1 } } }
    ]);

    const helpOfferCounts = await HelpOffer.aggregate([
      { $group: { _id: "$helper", total: { $sum: 1 } } }
    ]);

    const donationMap = {};
    donationCounts.forEach(d => {
      donationMap[d._id] = d.total;
    });

    const helpOfferMap = {};
    helpOfferCounts.forEach(h => {
      helpOfferMap[h._id.toString()] = h.total;
    });

    const usersWithStatus = users.map(user => {
      let friendStatus = 'not_friend';

      if (user.friends && user.friends.some(f => f.toString() === currentUserId)) {
        friendStatus = 'friend';
      } else if (
        requests.some(r =>
          (r.from.toString() === currentUserId && r.to.toString() === user._id.toString()) ||
          (r.to.toString() === currentUserId && r.from.toString() === user._id.toString())
        )
      ) {
        friendStatus = 'pending';
      }

      return {
        ...user,
        friendStatus,
        donationsCount: donationMap[user.name] || 0,
        helpOffersCount: helpOfferMap[user._id.toString()] || 0
      };
    });

    res.json(usersWithStatus);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Error searching users' });
  }
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

// Get all incoming friend requests
exports.getIncoming = async (req, res) => {
  try {
    const incoming = await FriendRequest.find({
      to: req.user.id,
      status: "pending",
    }).populate("from", "_id name avatar");

    res.json(Array.isArray(incoming) ? incoming : []);
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all outgoing friend requests
exports.getOutgoing = async (req, res) => {
  try {
    const outgoing = await FriendRequest.find({
      from: req.user.id,
      status: "pending",
    }).populate("to", "_id name avatar");

    res.json(Array.isArray(outgoing) ? outgoing : []);
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept a friend request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const fr = await FriendRequest.findOne({
      _id: requestId,
      to: req.user.id,
      status: "pending",
    });

    if (!fr) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    fr.status = "accepted";
    await fr.save();

    // Add each other to friends list
    await User.findByIdAndUpdate(fr.from, { $addToSet: { friends: fr.to } });
    await User.findByIdAndUpdate(fr.to, { $addToSet: { friends: fr.from } });

    res.json({ message: "Friend request accepted", requestId });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a friend request
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const fr = await FriendRequest.findOne({
      _id: requestId,
      to: req.user.id,
      status: "pending",
    });

    if (!fr) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    fr.status = "rejected";
    await fr.save();

    res.json({ message: "Friend request rejected", requestId });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Server error" });
  }
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

// Cancel a sent friend request
exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find pending request sent by current user
    const fr = await FriendRequest.findOne({
      _id: requestId,
      from: req.user.id,
      status: 'pending'
    });

    if (!fr) {
      return res.status(404).json({ message: 'Friend request not found or already processed' });
    }

    // Remove request
    await fr.deleteOne();

    res.json({ message: 'Friend request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling friend request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

