import mongoose from "mongoose";

// Smart Camera Schema
const smartCameraSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  image: { type: String, required: true },
});

// Card Schema for benefits
const cardSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  content: { type: String, required: true }, // Updated 'description' to 'content'
});

// Camera Benefit Schema (Stores one heading and multiple cards)
const cameraBenefitSchema = new mongoose.Schema({
  heading: { type: String, required: true }, 
  cards: [cardSchema], // Array of cards
});

// Exporting schemas
export { smartCameraSchema, cardSchema };
export default mongoose.model("CameraBenefit", cameraBenefitSchema);