

import KnowledgePartner from "../models/knowledgePartnerModel.js";
import { notifyClients } from "../services/socket.js";

// Get Knowledge Partners
export const getKnowledgePartners = async (req, res) => {
  try {
    const data = await KnowledgePartner.findOne();
    if (!data) return res.status(404).json({ message: "No data found!" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message
    });
  }
};

// Create Knowledge Partners
export const createKnowledgePartners = async (req, res) => {
  try {
    const existingData = await KnowledgePartner.findOne();
    if (existingData) return res.status(400).json({ message: "Data already exists!" });

    const newData = await KnowledgePartner.create(req.body);
    res.status(201).json({ message: "Data created successfully!", data: newData });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't create data!",
      error: error.message
    });
  }
};

// Update Knowledge Partners
export const updateKnowledgePartners = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID is required!" });

    const updatedData = await KnowledgePartner.findByIdAndUpdate(
      id, req.body, { new: true, runValidators: true }
    );

    if (!updatedData) return res.status(404).json({ message: "No data found to update!" });

    notifyClients("knowledgePartnersUpdated", updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't update the data!",
      error: error.message
    });
  }
};

// Delete Knowledge Partners
export const deleteKnowledgePartners = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID is required!" });

    const deletedData = await KnowledgePartner.findByIdAndDelete(id);
    if (!deletedData) return res.status(404).json({ message: "Nothing to delete!" });

    notifyClients("knowledgePartnersDeleted", deletedData);
    res.status(200).json({ message: "Deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't delete the data!",
      error: error.message
    });
  }
};
