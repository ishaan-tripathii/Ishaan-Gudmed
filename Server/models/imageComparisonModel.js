import mongoose from "mongoose";

// Define the schema for individual sections
const imageSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // e.g., "In English" or "हिन्दी में"
    trim: true, // Remove leading/trailing whitespace
  },
  beforeImage: {
    type: String,
    required: true, // URL to the "before" image
    trim: true, // Ensure no accidental spaces in URLs
  },
  afterImage: {
    type: String,
    required: true, // URL to the "after" image
    trim: true, // Ensure no accidental spaces in URLs
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Unique ID for each section
    default: () => new mongoose.Types.ObjectId(), // Auto-generate
  },
});

// Define the main schema for ImageComparison
const imageComparisonSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: "Sample Prescription",
    trim: true, // Remove unnecessary whitespace
  },
  description: {
    type: String,
    required: true,
    default: "Move the slider left and right to see the magic!",
    trim: true, // Remove unnecessary whitespace
  },
  sections: {
    type: [imageSectionSchema], // Array of sections
    default: () => [
      {
        title: "In English",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-english.png",
      },
      {
        title: "हिन्दी में",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-hindi.png",
      },
    ], // Default sections to match your initial data
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
  },
});

// Update `updatedAt` before every save
imageComparisonSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model using ES6 module syntax
const ImageComparison = mongoose.model("ImageComparison", imageComparisonSchema);
export default ImageComparison;