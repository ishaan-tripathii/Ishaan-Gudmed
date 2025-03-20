import mongoose from "mongoose";

const socialIconSchema = new mongoose.Schema({
  iconClass: String,
  link: String,
});

const footerSchema = new mongoose.Schema({
  copyright: {
    year: { type: Number, default: new Date().getFullYear() },
    companyName: { type: String, default: "Gud Medicare Solutions Pvt Ltd" },
    rightsReserved: { type: String, default: "All rights reserved ®" },
  },
  contact: {
    phone: { type: String, default: "+91-9999196828" },
    email: { type: String, default: "cs@gudmed.in" },
  },
  socialIcons: { type: [socialIconSchema], default: [] },
  logoUrl: { type: String, default: "/images/gudmed-logo.png" },
});

export default mongoose.model("Footer", footerSchema);
