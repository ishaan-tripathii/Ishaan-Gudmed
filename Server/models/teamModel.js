import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    designation: { type: String , required: true },
    content: { type: String, required: true }
});

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    description: { type: String, required: true }
});

const advisoryboardSchema = new mongoose.Schema({
    image: { type: String, required: true },
    imageUrl: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String , required: true },
    description: { type: String, required: true }
});

const teamSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    team: [teamMemberSchema],
    cards: [cardSchema],
    advisoryboard: [advisoryboardSchema]
});

export const Team = mongoose.model("Team", teamSchema)
