// clientModel.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  src: { type: String, required: true }, // URL or path to the image
  alt: { type: String, required: true }, // Alt text for accessibility
});

const clientSettingsSchema = new mongoose.Schema({
  clients: [clientSchema],
  swiperSettings: {
    slidesPerView: {
      default: { type: Number, default: 4 },
      breakpoints: {
        1200: { type: Number, default: 4 },
        1024: { type: Number, default: 3 },
        768: { type: Number, default: 3 },
        480: { type: Number, default: 2 },
        320: { type: Number, default: 2 },
      },
    },
    slidesPerGroup: {
      default: { type: Number, default: 4 },
      breakpoints: {
        1200: { type: Number, default: 4 },
        1024: { type: Number, default: 3 },
        768: { type: Number, default: 3 },
        480: { type: Number, default: 2 },
        320: { type: Number, default: 2 },
      },
    },
  },
});

export default mongoose.model("ClientSettings", clientSettingsSchema);