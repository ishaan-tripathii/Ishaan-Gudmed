import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  icon: { type: String },
  color: { type: String },
  title: { type: String },
  description: { type: String },
});

const sectionSchema = new mongoose.Schema({
  cardType: { 
    type: String,
    enum: ['highlight', 'motion'], 
    default: 'highlight'
  },
  cards: [cardSchema],
});

const aiPageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  titleColor: { type: String, default: '#000000' }, // Fixed field
  description: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  sections: [sectionSchema],
  updatedAt: { type: Date, default: Date.now },
});

aiPageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('AIPage', aiPageSchema);