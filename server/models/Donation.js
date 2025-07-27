const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
donorName: { type: String, required: true },
contact: { type: String, required: true },
category: { type: String, required: true }, // e.g., Essentials, Education, Electronics
itemType: { type: String, required: true }, // e.g., Clothes, Books, Food
quantity: { type: String, required: true },
condition: { type: String, required: true }, // e.g., New, Gently Used
city: { type: String, required: true },
description: { type: String },
image: { type: String, default: "" }, // Cloudinary/URL
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
