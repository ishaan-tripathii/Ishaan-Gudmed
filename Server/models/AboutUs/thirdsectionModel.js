import mongoose from "mongoose";

const thirdsectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },      // Ensure heading is always provided
  description: { type: String, required: true }   // Ensure description is always provided
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const ThirdSection = mongoose.model("ThirdSection", thirdsectionSchema);

export default ThirdSection;
