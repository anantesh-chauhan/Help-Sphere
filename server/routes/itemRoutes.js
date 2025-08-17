const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { createItem, getUnclaimedItems, claimItem, autoDonateItems, getMyDonations, getMyClaims } = require("../controllers/itemController");
const auth = require("../middleware/auth");

// ⚙️ Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📦 Create item donation (auth required)
router.post("/create", auth, createItem);

// 🔎 Get unclaimed items
router.get("/unclaimed", getUnclaimedItems);

// 🤝 Claim an item
router.post("/claim/:id", auth, claimItem);

// ⏰ Auto donate
router.get("/auto-donate", autoDonateItems);

router.get("/my-donations/:userId", auth, getMyDonations );

router.get("/my-claims/:userId", auth, getMyClaims);
module.exports = router;
