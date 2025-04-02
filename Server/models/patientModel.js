import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    heading: { type: String },
    subheading: { type: String },
    image: { type: String },
    button: { type: String }
});

const featureSchema = new mongoose.Schema({
    image: { type: String },  // Missing comma added here
    content: { type: String }
});

export { patientSchema, featureSchema };
