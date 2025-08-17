const Friend = require("../models/FriendRequest.js");

/**
 * Ensures two users are friends (status=accepted).
 * Reads (senderId, receiverId) from body OR (userId, friendId) from params/body.
 */
const requireFriendship = async (req, res, next) => {
  try {
    // console.log("requireFriendship middleware called : ",req.body ,req.user._id);
    const senderId = req.user._id;
    const receiverId = req.body.receiverId || req.body.receiver || req.params.friendId;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId and receiverId are required" });
    }

    const friendship = await Friend.findOne({
      $or: [
        { from: senderId, to: receiverId, status: "accepted" },
        { from: receiverId, to: senderId, status: "accepted" },
      ],
    });
    console.log('friendship found : ');
    if (!friendship) {
      return res.status(403).json({ message: "Chat allowed only between friends." });
    }
    console.log("Friendship found:", friendship);
    next();
  } catch (err) {
    console.error("Friendship check error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = requireFriendship;
