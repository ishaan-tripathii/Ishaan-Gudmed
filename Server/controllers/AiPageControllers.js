import mongoose from "mongoose";
import AIPage from "../models/aiPageModel.js";
import { notifyClients } from "../services/socket.js";

export const fetchAIPages = async (req, res) => {
  try {
    const { slug } = req.query;
    const { id } = req.params;

    let pages;
    if (id) {
      pages = await AIPage.findById(id);
      console.log(`Fetched AI Page by ID: ${id}`);
      if (!pages) {
        console.warn(`Page not found for ID: ${id}`);
        return res.status(404).json({ success: false, message: "Page not found" });
      }
    } else if (slug) {
      pages = await AIPage.find({ slug });
      console.log(`Fetched AI Pages by Slug: ${slug}`);
      if (!pages.length) {
        console.warn(`No pages found with slug: ${slug}`);
        return res.status(404).json({ success: false, message: "No pages found with this slug" });
      }
    } else {
      pages = await AIPage.find();
      console.log("Fetched all AI Pages");
    }

    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching AI Pages:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const createAIPage = async (req, res) => {
  try {
    const page = await AIPage.create(req.body);
    console.log("Created AI Page:", page);
    notifyClients("aiPageUpdated", page); // Emit the raw page object
    return res.status(201).json({ success: true, message: "AI Page created successfully", data: page });
  } catch (error) {
    console.error("Error creating AI Page:", error);
    return res.status(400).json({ success: false, message: "Failed to create page", error: error.message });
  }
};

export const updateAIPage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid or missing page ID: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid or missing page ID" });
    }
    const updatedPage = await AIPage.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedPage) {
      console.warn(`Page not found for update, ID: ${id}`);
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    console.log("Updated AI Page:", updatedPage);
    notifyClients("aiPageUpdated", updatedPage); // Emit the raw page object
    res.status(200).json({ success: true, message: "AI Page updated successfully", data: updatedPage });
  } catch (error) {
    console.error("Error updating AI Page:", error);
    res.status(400).json({ success: false, message: "Failed to update page", error: error.message });
  }
};

export const deleteAIPage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid or missing page ID: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid or missing page ID" });
    }
    const deletedPage = await AIPage.findByIdAndDelete(id);
    if (!deletedPage) {
      console.warn(`Page not found for deletion, ID: ${id}`);
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    console.log(`Deleted AI Page with ID: ${id}`);
    notifyClients("aiPageUpdated", { _id: id, deleted: true });
    res.status(200).json({ success: true, message: "AI Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI Page:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};