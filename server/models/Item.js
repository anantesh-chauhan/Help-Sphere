const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // Basic Info (common)
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['food', 'clothes', 'books', 'toys', 'electronics', 'furniture', 'household', 'others'], 
    required: true 
  },
  imageUrls: [{ type: String, required: true }],
  quantity: { type: String, required: true }, // e.g., "1 item", "2 kg", "5 books"

  // Food-specific fields (optional, shown only if category === 'food')
  isPerishable: { type: Boolean, default: false },
  cookedAt: { type: Date }, // when the food was cooked
  expiryDate: { type: Date }, // food or medicine expiry
  isVeg: { type: Boolean }, // vegetarian or non-veg
  foodType: { type: String }, // e.g., "cooked", "dry", "raw"
  storageInfo: { type: String }, // e.g., "Keep refrigerated"
  allergens: [{ type: String }], // e.g., ["nuts", "gluten"]

  // Clothes-specific fields (optional)
  size: { type: String }, // S, M, L, XL etc.
  color: { type: String },
 gender: {
  type: String,
  enum: ['male', 'female', 'unisex'],
  required: false,          // Make it optional
  validate: {
    validator: function(v) {
      return !v || ['male', 'female', 'unisex'].includes(v);
    },
    message: props => `${props.value} is not a valid gender option.`
  }
},


  // Electronics-specific fields (optional)
  brand: { type: String },
  isWorking: { type: Boolean },
  powerRequirement: { type: String }, // e.g., "220V AC", "Battery-powered"

  // Book-specific (optional)
  language: { type: String },
  subject: { type: String }, // e.g., "Math", "History"
  isTextbook: { type: Boolean },

  // Pickup & contact
  pickupAddress: { type: String },
  contactNumber: { type: String },
  canDeliver: { type: Boolean, default: false },

  // Ownership
  donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  claimedAt: { type: Date },
  donatedToNGO: { type: Boolean, default: false },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", default: null },

  // Metadata
  status: { 
    type: String, 
    enum: ['unclaimed', 'claimed', 'donated'], 
    default: 'unclaimed' 
  },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
