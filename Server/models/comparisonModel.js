// backend/models/comparisonModel.js
import mongoose from "mongoose";

const comparisonItemSchema = new mongoose.Schema({
  aspect: { type: String, required: true },
  other: {
    text: { type: String, required: true },
    icon: { type: String, required: true }, // Store icon name as string (e.g., "DocumentDuplicateIcon")
  },
  gudmed: {
    text: { type: String, required: true },
    icon: { type: String, required: true }, // Store icon name as string
  },
});

const comparisonSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "GudMed vs Other Technologies" },
  items: [comparisonItemSchema],
});

export default mongoose.model("Comparison", comparisonSchema);