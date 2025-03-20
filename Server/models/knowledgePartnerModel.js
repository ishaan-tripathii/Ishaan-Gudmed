// backend/models/knowledgePartnerModel.js
import mongoose from "mongoose";

// Partner Schema
const partnerSchema = new mongoose.Schema({
  title: String,
  image: String
});

// Knowledge Partner Schema
const knowledgePartnerSchema = new mongoose.Schema({
  partners: [partnerSchema],
  accreditations: [partnerSchema],
  twoFactorsImage: String,

  // Titles with default values
  titles: {
    weAre: String,
    accredited: String,
    knowledgePartners: String
  }
});

export default mongoose.model("KnowledgePartner", knowledgePartnerSchema);
