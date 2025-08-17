const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ["text", "gif"], default: "text" },
    delivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true, _id: true }
);

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, enum: ["text", "gif"], default: "text" },
    text: { type: String, required: true },

    delivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },

    replies: [replySchema], // Threaded replies
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
