// backend/models/knowledgePartnerModel.js
import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // URL to the image
});

const knowledgePartnerSchema = new mongoose.Schema({
  partners: [partnerSchema], // Knowledge Partners
  accreditations: [partnerSchema], // Accreditations
  twoFactorsImage: { type: String, required: true }, // URL for "Two Factors" image
  titles: {
    weAre: { type: String, required: true, default: "We Are !" },
    accredited: { type: String, required: true, default: "Accredited" },
    knowledgePartners: { type: String, required: true, default: "Our Knowledge Partners" },
  },
});

export default mongoose.model("KnowledgePartner", knowledgePartnerSchema);