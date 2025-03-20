import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  description: { type: String },
});

const whyGudMedPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    cards: [cardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("WhyGudMedPage", whyGudMedPageSchema);