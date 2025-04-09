import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    content: { type: String, required: true }
});

//Digital Hospital Schema 
const digitalHospitalSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    features: [featureSchema] // Array of features
});


// Exporting the Digital Hospital model
export default mongoose.model("digitalHospital", digitalHospitalSchema);