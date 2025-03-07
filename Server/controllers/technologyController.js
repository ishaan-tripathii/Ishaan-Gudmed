import TechnologyPage from "../models/TechnologyPage.js";
import { notifyClients } from "../services/socket.js";

// Get all pages or a specific page by slug or ID
export const getTechnologyPages = async (req, res) => {
  try {
    const { slug, id } = req.query;
    let pages;
    if (id) {
      pages = await TechnologyPage.findById(id);
      if (!pages) return res.status(404).json({ message: "Page not found" });
      return res.json(pages);
    } else if (slug) {
      pages = await TechnologyPage.find({ slug });
      if (pages.length === 0) return res.status(404).json({ message: "No pages found with this slug" });
    } else {
      pages = await TechnologyPage.find();
    }
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new technology page
export const createTechnologyPage = async (req, res) => {
  try {
    const page = new TechnologyPage(req.body);
    await page.save();
    notifyClients(page.slug);
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ message: "Failed to create page", error: error.message });
  }
};

// Update an existing technology page
export const updateTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing page ID" });
    }
    const page = await TechnologyPage.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ message: "Page not found" });
    notifyClients(page.slug);
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: "Failed to update page", error: error.message });
  }
};

// Delete a technology page
export const deleteTechnologyPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await TechnologyPage.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    notifyClients(page.slug);
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};