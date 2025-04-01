import AboutUs from "../models/AboutUs/aboutUs.js";
import { notifyClients } from "../services/socket.js";

// Get About Us data
export const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({});
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    res.status(200).json({ success: true, data: aboutUs });
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create About Us data
export const createAboutUs = async (req, res) => {
  try {
    const { heading, subheading, description, imageUrl } = req.body;
    
    const newAboutUs = new AboutUs({
      heading,
      subheading,
      description,
      imageUrl,
    });

    const savedAboutUs = await newAboutUs.save();
    notifyClients("aboutUsUpdated", savedAboutUs); // Notify clients via WebSocket
    
    res.status(201).json({ success: true, data: savedAboutUs });
  } catch (error) {
    console.error("Error creating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update About Us data
export const updateAboutUs = async (req, res) => {
  try {
    const { heading, subheading, description, imageUrl } = req.body;

    const updatedAboutUs = await AboutUs.findOneAndUpdate(
      {},
      { heading, subheading, description, imageUrl },
      { new: true, upsert: true, returnOriginal: false } // Ensure proper MongoDB behavior
    );

    if (!updatedAboutUs) {
      return res.status(404).json({ success: false, message: "Failed to update About Us data" });
    }

    notifyClients("aboutUsUpdated", updatedAboutUs); // Notify clients via WebSocket
    res.status(200).json({ success: true, data: updatedAboutUs });
  } catch (error) {
    console.error("Error updating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete About Us data
export const deleteAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOneAndDelete({});
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }

    notifyClients("aboutUsDeleted", null); // Notify clients via WebSocket
    res.status(200).json({ success: true, message: "About Us data deleted successfully" });
  } catch (error) {
    console.error("Error deleting About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
