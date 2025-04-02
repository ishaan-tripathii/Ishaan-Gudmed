import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    icon: { type: String },           // Icon name (e.g., "FaHospital")
    iconColor: { type: String },      // New field for icon color (e.g., "#FF0000" or "red")
    title: { type: String },
    description: { type: String },
});

const ourAchievementsSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    cards: [cardSchema],
}, { timestamps: true });

export default mongoose.model('OurAchievements', ourAchievementsSchema);