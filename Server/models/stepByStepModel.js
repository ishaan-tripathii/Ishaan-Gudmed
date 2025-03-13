// backend/models/stepByStepModel.js
import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Step 1"
  description: { type: String, required: true }, // e.g., "Doctors continue to write prescriptions..."
  icon: { type: String, required: true }, // URL or SVG identifier
});

const stepByStepSchema = new mongoose.Schema({
  heading: { type: String, required: true, default: "🔧 HOW WE WORKS?" },
  subheading: { type: String, required: true, default: "Simplifying Healthcare with GudMed: 🔧" },
  description: {
    type: String,
    required: true,
    default:
      "At GudMed, we believe technology should enhance your work, not complicate it. Our solution keeps it simple and effective.",
  },
  steps: [stepSchema],
});

export default mongoose.model("StepByStep", stepByStepSchema);