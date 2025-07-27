const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: {
    type :String,
    unique: true
  },
  email:{
    type :String,
    unique: true
  },
  phone:{
    type :String,
    unique: true
  },
  address: String,
  city: String,
  pinCode: {
    type:Number,
    default : 0
  },
  registrationNumber: String,
  foundedYear: Number,
  mission: String,
  type: String,
  website: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);
