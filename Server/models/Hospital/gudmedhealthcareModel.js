import mongoose from "mongoose";

// Gudmed Healthcare Schema
const cardSchema = new mongoose.Schema({
    icon: { type: String },
    color: { type: String },
    heading: { type: String },
});

const featureSchema = new mongoose.Schema({
    icon: { type: String },
    content: { type: String }
})

const healthcareSchema = new mongoose.Schema({
    heading: { type: String },
    cards: [cardSchema],
    features: [featureSchema]
});


// exporting the Gudmed Healthcare model

export default mongoose.model("gudmedHealthcare", healthcareSchema);
