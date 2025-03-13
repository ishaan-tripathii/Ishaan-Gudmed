// backend/models/counterModel.js
import mongoose from "mongoose";

const counterItemSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g., "Prescriptions Served"
  number: { type: Number, required: true }, // e.g., 2650627
  icon: { type: String, required: true }, // URL to the image
});

const counterSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Our Impact" },
  items: [counterItemSchema],
});

export default mongoose.model("Counter", counterSchema);