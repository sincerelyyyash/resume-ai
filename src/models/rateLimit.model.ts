import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

rateLimitSchema.index({ ip: 1, endpoint: 1, timestamp: 1 });

export default mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);
