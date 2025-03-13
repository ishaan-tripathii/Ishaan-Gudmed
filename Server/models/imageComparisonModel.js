import mongoose from "mongoose";

const imageSectionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "In English" or "हिन्दी में"
  beforeImage: { type: String, required: true }, // URL to before image
  afterImage: { type: String, required: true }, // URL to after image
});

const imageComparisonSchema = new mongoose.Schema({
  heading: { type: String, required: true, default: "Sample Prescription" },
  description: {
    type: String,
    required: true,
    default: "Move the slider left and right to see the magic!",
  },
  sections: [imageSectionSchema],
});

export default mongoose.model("ImageComparison", imageComparisonSchema);