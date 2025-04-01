import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  aspect: String,
  other: { text: String, icon: String },
  gudmed: { text: String, icon: String }
}, { required: true });

const comparisonSchema = mongoose.Schema({
  title: { type: String, default: "GudMed vs Other Technologies" },
  items: [itemSchema]
});

export default mongoose.model("Comparison", comparisonSchema);
