// backend/controllers/knowledgePartnerController.js (unchanged)
import KnowledgePartner from "../models/knowledgePartnerModel.js";
import { notifyClients } from "../services/socket.js";

export const getKnowledgePartners = async (req, res) => {
  try {
    const data = await KnowledgePartner.findOne();
    if (!data) {
      const newData = new KnowledgePartner({ partners: [], accreditations: [], twoFactorsImage: "" });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

export const updateKnowledgePartners = async (req, res) => {
  try {
    const data = await KnowledgePartner.findOne();
    if (!data) {
      const newData = new KnowledgePartner(req.body);
      await newData.save();
      notifyClients("knowledgePartnersUpdated");
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("knowledgePartnersUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating data", error });
  }
};