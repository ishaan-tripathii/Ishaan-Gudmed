import mongoose from 'mongoose';

const benefitSchema = new mongoose.Schema({
  heading: String,
  description: String,
});

const pageSchema = new mongoose.Schema({
  titleDesktop: { type: String, required: true },
  titleMobile: { type: String, required: true },
  gradientWords: [String],
  gradient: String,
  benefits: [benefitSchema],
  slug: { type: String, unique: true, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Page', pageSchema);