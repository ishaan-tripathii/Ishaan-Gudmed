import mongoose from 'mongoose';

const keyfeatureSchema = new mongoose.Schema({
    image: String,
    content: String
});

const featureSchema = new mongoose.Schema({
    title: String,
    keyFeatures: [keyfeatureSchema] // Directly embedding the array of objects
});

const patientSchema = new mongoose.Schema({
    heading: String,
    subheading: String,
    image: String,
    button1: String,
    button2: String,
    button1colour: String,
    button2colour: String,
    buttonUrl1: String,
    buttonUrl2: String,
    features: [featureSchema] // Directly embedding the array of objects
});

export { patientSchema };

