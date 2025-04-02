import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  heading: { type: String, required: true, default: "About Us" },
  subheading: { type: String, required: true, default: "Who we are" },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

export default AboutUs;