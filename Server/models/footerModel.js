import mongoose from "mongoose";

const socialIconSchema = new mongoose.Schema({
  iconClass: { type: String, required: true }, // e.g., "fab fa-whatsapp"
  link: { type: String, required: true }, // e.g., "https://wa.me/919999196828"
});

const footerSchema = new mongoose.Schema({
  copyright: {
    year: { type: Number, required: true, default: 2025 },
    companyName: { type: String, required: true, default: "Gud Medicare Solutions Private Limited" },
    rightsReserved: { type: String, required: true, default: "All rights reserved ®" },
  },
  contact: {
    phone: { type: String, required: true, default: "+91-9999196828" },
    email: { type: String, required: true, default: "cs@gudmed.in" },
  },
  socialIcons: [socialIconSchema],
  logoUrl: { type: String, required: true, default: "http://localhost:5000/images/gudmed-logo.png" },
});

export default mongoose.model("Footer", footerSchema);