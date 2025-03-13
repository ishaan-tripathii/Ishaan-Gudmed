import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  icon: { type: String }, // Optional, e.g., "FaHospital"
  title: { type: String }, // Optional
  description: { type: String }, // Optional
});

const sectionSchema = new mongoose.Schema({
  cardType: { 
    type: String, 
    enum: ["highlight", "motion"], 
    default: "highlight" // Optional with default
  },
  cards: [cardSchema],
});

const technologyPageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g., "GudMed’s Technology"
  description: { type: String, required: true }, // Required for page
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  }, // e.g., "technology"
  sections: [sectionSchema],
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` before saving
technologyPageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("TechnologyPage", technologyPageSchema);