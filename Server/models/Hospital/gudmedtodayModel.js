import mongoose from 'mongoose';

// First define sub-schemas

const cardSchema = new mongoose.Schema({
    icon: { type: String },
    color: { type: String },
    heading: { type: String },
    content: { type: String }
});

const futureSchema = new mongoose.Schema({
    heading: { type: String },
    description: { type: String },
    button: { type: String },
    buttoncolor: { type: String },
    buttonUrl: { type: String },
    buttontext: { type: String }
});

// Then use them in the main schema

const gudmedSchema = new mongoose.Schema({
    heading: { type: String },
    description: { type: String },
    cards: [cardSchema],
    future: [futureSchema]
});

// Export the model
export default mongoose.model("gudmedTransforms", gudmedSchema);
