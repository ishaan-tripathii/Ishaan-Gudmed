import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  icon: { type: String }, // Optional Icon
  title: { type: String }, // Optional Title
  description: { type: String }, // Optional Description
});

const aiPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, // Required Page Title
    description: { type: String, required: true }, // Required Page Description
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // URL Slug
    cards: [cardSchema], // Array of Multiple Cards
  },
  { timestamps: true } // Auto-createdAt & updatedAt
);

export default mongoose.model("AIPage", aiPageSchema);
