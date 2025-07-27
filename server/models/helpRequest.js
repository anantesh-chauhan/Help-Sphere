const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },

 category: {
  type: String,
  enum: [
    'Food',
    'Medicine',
    'Shelter',
    'Transport',
    'Education',
    'Clothing',
    'Legal Aid',
    'Financial Support',
    'Mental Health',
    'Employment',
    'Other'
  ],
  default: 'Other'
},


  location: {
    type: String,
    default: 'Not specified',
    trim: true
  },

  phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits'],
    default: ''
  },



  message: {
    type: String,
    default: '',
    trim: true
  },

  neededBy: {
    type: Date
  },

  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'rejected'],
    default: 'pending'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  offers: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  offeredAt: { type: Date, default: Date.now }
}],

  attachments: [{
    type: String 
  }],

  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }

}, { timestamps: true }); 

// Enable geospatial indexing if using geoLocation
helpRequestSchema.index({ geoLocation: '2dsphere' });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
