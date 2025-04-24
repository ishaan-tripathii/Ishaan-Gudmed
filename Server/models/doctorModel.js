import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    heading: String,
    subheading: String,
    image: String,
    button1: String,
    button2: String,
    button1colour: String,
    button2colour: String,
    buttonUrl1: String,
    buttonUrl2: String,
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }]
});

const featureSchema = new mongoose.Schema({
    title: String,
    keyFeatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyFeature" }]
});

const keyfeatureSchema = new mongoose.Schema({
    image: String,
    content: String
});

export { doctorSchema };
