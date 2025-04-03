import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    heading: { type: String },
    subheading: { type: String },
    image: { type: String },
    button1: { type: String },
    button2: { type: String },
    button1colour: { type: String },
    button2colour: { type: String },  
    buttonUrl1: { type: String },
    buttonUrl2: { type: String },
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }] 
});

const featureSchema = new mongoose.Schema({
    title: { type: String },  
    keyFeatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyFeature" }]
});

const keyfeatureSchema = new mongoose.Schema({
    image: { type: String },
    content: { type: String }
});

export { patientSchema, featureSchema, keyfeatureSchema };
