import mongoose from "mongoose";
import TechnologyPage from "../models/TechnologyPage.js";
import { notifyClients } from "../services/socket.js";

export const getTechnologyPages = async (req, res) => {
  try {
    const { slug } = req.query;
    const { id } = req.params;

    let pages;
    if (id) {
      pages = await TechnologyPage.findById(id);
      if (!pages) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
    } else if (slug) {
      pages = await TechnologyPage.find({ slug });
      if (!pages.length) {
        return res.status(404).json({ success: false, message: "No pages found with this slug" });
      }
    } else {
      pages = await TechnologyPage.find();
    }

    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const createTechnologyPage = async (req, res) => {
  try {
    const page = await TechnologyPage.create(req.body);
    notifyClients("contentUpdated", page); // Emit event
    return res.status(201).json({ success: true, message: "Page created successfully", data: page });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Failed to create page", error: error.message });
  }
};

export const updateTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing page ID" });
    }
    const updatedPage = await TechnologyPage.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedPage) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    notifyClients("contentUpdated", updatedPage); // Emit event
    res.status(200).json({ success: true, message: "Page updated successfully", data: updatedPage });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update page", error: error.message });
  }
};

export const deleteTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing page ID" });
    }
    const deletedPage = await TechnologyPage.findByIdAndDelete(id);
    if (!deletedPage) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    notifyClients("contentUpdated", { id: deletedPage._id }); // Emit event
    res.status(200).json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};