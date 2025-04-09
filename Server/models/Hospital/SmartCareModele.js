import mongoose from "mongoose";

const SmartCareSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description1: { type: String },
  description2: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SmartCare", SmartCareSchema);
