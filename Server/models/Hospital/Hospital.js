import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageSrc: { type: String },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Hospital", hospitalSchema);