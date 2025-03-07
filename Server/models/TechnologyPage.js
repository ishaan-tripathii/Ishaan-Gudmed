import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  icon: { type: String, required: true }, // e.g., "FaHospital"
  title: { type: String, required: true },
  description: { type: String, required: true },
  bgColor: { type: String }, // Optional, used for "motion" cardType
});

const sectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, default: "" }, // Optional, defaults to empty string
  sectionDescription: { type: String, default: "" }, // Optional, defaults to empty string
  cardType: { 
    type: String, 
    enum: ["highlight", "motion"], 
    required: true, 
    default: "highlight" 
  },
  cards: [cardSchema],
});

const technologyPageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g., "GudMed’s Technology"
  description: { type: String, required: true },
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