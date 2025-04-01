import mongoose from 'mongoose';

// Schema for individual features
const gudmedFeatureSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true }
});

// Main schema for GudMed Smart Hospital
const gudmedSmartHospitalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },  // <-- FIXED: Added missing comma
    features: [gudmedFeatureSchema],  // Array of feature objects
    createdAt: { type: Date, default: Date.now },  // Auto-generated timestamp
    image: { type: String } // Optional image URL
});

// Creating and exporting the model
const gudmedSmartHospital = mongoose.model("gudmedSmartHospital", gudmedSmartHospitalSchema);

export default gudmedSmartHospital;
