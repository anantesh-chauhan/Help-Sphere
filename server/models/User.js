 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, 'Phone must be 10 digits'],
        default: '0000000000'
    },
    avatar: {
        type: String,
        default: '' // URL or base64
    },
    password: {
        type: String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    password_otp: {
        otp: { type: String },
        send_time: { type: String },
        limit: { type: Number, default: 5 }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
