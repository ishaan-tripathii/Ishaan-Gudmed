import AboutUs from "../models/AboutUs/aboutUs.js";
import { notifyClients } from "../services/socket.js";

// Get About Us data (unchanged, but could return multiple documents if needed)
export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({}); // Consider changing to .find() for multiple documents
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create About Us data (unchanged)
export const createAboutUs = async (req, res) => {
  try {
    const { heading, subheading, description, imageUrl } = req.body;
    const newAboutUs = new AboutUs({ heading, subheading, description, imageUrl });
    const savedAboutUs = await newAboutUs.save();
    notifyClients?.("aboutUsUpdated", savedAboutUs);
    res.status(201).json({ success: true, data: savedAboutUs });
  } catch (error) {
    console.error("Error creating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update About Us data by ID
export const updateAboutUs = async (req, res) => {
  try {
    const { heading, subheading, description, imageUrl } = req.body;
    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id, // Use ID from URL
      { heading, subheading, description, imageUrl },
      { new: true } // Return the updated document
    );
    if (!updatedAboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    notifyClients?.("aboutUsUpdated", updatedAboutUs);
    res.status(200).json({ success: true, data: updatedAboutUs });
  } catch (error) {
    console.error("Error updating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete About Us data by ID
export const deleteAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndDelete(req.params.id); // Use ID from URL
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    notifyClients?.("aboutUsUpdated", null); // Or use "aboutUsDeleted" if preferred
    res.status(200).json({ success: true, message: "About Us data deleted successfully" });
  } catch (error) {
    console.error("Error deleting About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};