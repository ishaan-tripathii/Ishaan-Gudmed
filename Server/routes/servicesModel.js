import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    color: { type: String, required: true }, 
    heading: { type: String, required: true },
    description: { type: String, required: true }
});

const worksSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true }, 
    content: { type: String, required: true }
});

const servicesSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    cards: [cardSchema], 
    works: [worksSchema] 
});

export const Service = mongoose.model('Service', servicesSchema);
