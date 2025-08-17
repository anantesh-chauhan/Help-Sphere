const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // type "gif" means `text` holds a GIF URL; emojis are included in text for "text"
    type: { type: String, enum: ["text", "gif"], default: "text" },
    text: { type: String, required: true },

    delivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
