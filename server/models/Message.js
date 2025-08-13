import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    readAt: { type: Date }
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model('Message', messageSchema);
