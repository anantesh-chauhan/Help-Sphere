const express = require("express");
const requireFriendship = require("../middleware/requireFriendship.js");
const {
  sendMessage,
  getMessages,
  markSeen,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.get("/:chatId", getMessages); // (optional) add membership check
router.post("/send",auth, requireFriendship, sendMessage);
router.post("/seen", auth, requireFriendship, markSeen);
router.patch("/:messageId", auth, requireFriendship, editMessage);
router.delete("/:messageId", auth, requireFriendship, deleteMessage);

module.exports = router;
