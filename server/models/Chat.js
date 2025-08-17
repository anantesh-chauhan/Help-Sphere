const mongoose = require("mongoose");

const unreadSubSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // size=2
    lastMessage: {
      text: { type: String, default: "" },
      type: { type: String, enum: ["text", "gif"], default: "text" }, // emojis are plain text
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
      seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    unread: [unreadSubSchema], // per-user unread counts
  },
  { timestamps: true }
);

chatSchema.index({ members: 1 });

module.exports = mongoose.model("Chat", chatSchema);
