import mongoose from "mongoose";

// Step Schema
const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },      // Example: "Step 1"
  description: { type: String, required: true }, // Example: "Doctors continue to write prescriptions..."
  icon: { type: String, required: true }         // Example: URL or SVG
});

// Main Schema
const stepByStepSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: "🔧 HOW WE WORKS?"
  },
  subheading: {
    type: String,
    required: true,
    default: "Simplifying Healthcare with GudMed: 🔧"
  },
  description: {
    type: String,
    required: true,
    default: "At GudMed, we believe technology should enhance your work, not complicate it."
  },
  steps: [stepSchema]  // Array of step objects
});

// Export Model
const StepByStep = mongoose.model("StepByStep", stepByStepSchema);
export default StepByStep;
