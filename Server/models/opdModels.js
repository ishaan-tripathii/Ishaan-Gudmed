import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  image: { type: String },
  heading: { type: String },
  content: { type: String },
});

const benefitSchema = new mongoose.Schema({
  icon: { type: String },
  iconColor: { type: String },
  heading: { type: String },
  content: { type: String },
});

const technologySchema = new mongoose.Schema({
  heading: { type: String },
  cards: [cardSchema],
  benefit: [benefitSchema],
});

const OPD = mongoose.model('OPD', technologySchema); // Registering once
export default OPD;
