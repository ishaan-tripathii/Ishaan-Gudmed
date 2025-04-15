import mongoose from "mongoose";

const gudmedTodaySchema = new mongoose.Schema({
    // Define the schema fields
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const GudmedToday = mongoose.model("GudmedToday", gudmedTodaySchema);

export default GudmedToday;
