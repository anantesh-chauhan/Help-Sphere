const Item = require("../models/Item");

// 📦 Create donated item (handles all types)
const createItem = async (req, res) => {
  const {
    title,
    description,
    category,
    quantity,
    expiryDate,
    isPerishable,
    cookedAt,
    storageInfo,
    isVeg,
    foodType,
    allergens,
    size,
    color,
    gender,
    brand,
    isWorking,
    powerRequirement,
    pickupAddress,
    contactNumber,
    canDeliver,
    imageUrls
  } = req.body;

  const userId = req.user._id;

  try {
    const item = await Item.create({
      title,
      description,
      category,
      quantity,
      expiryDate,
      isPerishable,
      cookedAt,
      storageInfo,
      isVeg,
      foodType,
      allergens,
      size,
      color,
      gender,
      brand,
      isWorking,
      powerRequirement,
      pickupAddress,
      contactNumber,
      canDeliver,
      imageUrls,
      donatedBy: userId,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Item creation error:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
};

// 🔎 Get unclaimed items
const getUnclaimedItems = async (req, res) => {
  try {
    const items = await Item.find({ claimedBy: null, donatedToNGO: false });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unclaimed items" });
  }
};

// 🤝 Claim an item
const claimItem = async (req, res) => {
  const  userId  = req.user._id;
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.claimedBy || item.donatedToNGO) {
      return res.status(400).json({ error: "Item unavailable" });
    }
    item.claimedBy = userId;
    item.claimedAt = new Date();
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to claim item" });
  }
};

// ⏰ Auto donate unclaimed items to NGO
const autoDonateItems = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const items = await Item.find({
      claimedBy: null,
      createdAt: { $lt: twentyFourHoursAgo },
      donatedToNGO: false,
    });

    for (const item of items) {
      item.donatedToNGO = true;
      await item.save();
    }

    res.json({
      message: "Checked and donated unclaimed items to NGOs",
      count: items.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Auto-donation failed" });
  }
};

const getMyDonations = async (req, res) => {
  const  userId  = req.user._id;

  try {
    const donations = await Item.find({donatedBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching user donations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all donations claimed by the current user
const getMyClaims = async (req, res) => {
  const  userId  = req.user._id;

  try {
    const claims = await Item.find({ claimedBy: userId }).sort({ claimedAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claimed items:", error);
    res.status(500).json({ error: "Failed to retrieve claimed donations" });
  }
};

module.exports = {
  createItem,
  getUnclaimedItems,
  claimItem,
  autoDonateItems,
  getMyDonations,
  getMyClaims
};
