const express = require("express");
const requireFriendship = require("../middleware/requireFriendship.js");
const { openChat, getUserChats } = require("../controllers/chatController.js");

const router = express.Router();

// Open or get a 1:1 chat (friends-only)
router.post("/open", requireFriendship, openChat);

// Get all chats for a user
router.get("/user/:userId", getUserChats);

module.exports = router;
