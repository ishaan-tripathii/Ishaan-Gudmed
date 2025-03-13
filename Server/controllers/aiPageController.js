import AIPage from "../models/aiPageModel.js";
import { notifyClients } from "../services/socket.js";

// Get all AI pages or a single page by ID/slug
export const getAIPages = async (req, res) => {
  try {
    const { id } = req.params;
    const pages = id
      ? await AIPage.findOne({ _id: id }) // Get single page by ID
      : await AIPage.find(); // Get all pages
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI Pages", error });
  }
};

// Create AI Page
export const createAIPage = async (req, res) => {
  try {
    const { title, description, slug, cards } = req.body;
    const newPage = new AIPage({ title, description, slug, cards });
    await newPage.save();
    notifyClients(); // Notify clients after creation
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: "Error creating AI Page", error });
  }
};

// Update AI Page
export const updateAIPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPage = await AIPage.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    notifyClients(); // Notify clients after update
    res.status(200).json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: "Error updating AI Page", error });
  }
};

// Delete AI Page
export const deleteAIPage = async (req, res) => {
  try {
    const { id } = req.params;
    await AIPage.findByIdAndDelete(id);
    notifyClients(); // Notify clients after deletion
    res.status(200).json({ message: "AI Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting AI Page", error });
  }
};