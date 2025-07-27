const mongoose = require('mongoose');

const HelpOfferSchema = new mongoose.Schema({
  helpRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('HelpOffer', HelpOfferSchema);
