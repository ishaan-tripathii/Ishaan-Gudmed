import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    icon: { type: String },
    title: { type: String },
    description: { type: String },
});

const ourAchievementsSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    cards: [cardSchema], // ✅ "cards" instead of "cardSchema"
}, { timestamps: true });

export default mongoose.model('OurAchievements', ourAchievementsSchema);
