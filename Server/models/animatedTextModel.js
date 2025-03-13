import mongoose from "mongoose";

const textItemSchema = new mongoose.Schema({
  text: { type: String, required: true }, // e.g., "Faster Discharges = Higher Bed Turnover ⏩"
  icon: { type: String, required: true }, // e.g., "FaRobot"
});

const animatedTextSchema = new mongoose.Schema({
  redMarquee: [textItemSchema], // Items for the red background marquee
  blackMarquee: [textItemSchema], // Items for the black background marquee
});

export default mongoose.model("AnimatedText", animatedTextSchema);