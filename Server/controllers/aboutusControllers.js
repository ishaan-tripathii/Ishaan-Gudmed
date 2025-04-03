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
    // Check if an "About Us" document already exists
    const existingAboutUs = await AboutUs.findOne({});
    if (existingAboutUs) {
      return res.status(400).json({ success: false, message: "About Us data already exists. Use update instead." });
    }
    const { heading, subheading, description, imageUrl } = req.body;
    const newAboutUs = new AboutUs({ heading, subheading, description, imageUrl });
    const savedAboutUs = await newAboutUs.save();
    notifyClients("aboutUsCreated", savedAboutUs); // Emit "aboutUsCreated" event
    res.status(201).json({ success: true, data: savedAboutUs });
  } catch (error) {
    console.error("Error creating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const updateAboutUs = async (req, res) => {
  try {
    const { heading, subheading, description, imageUrl } = req.body;
    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      { heading, subheading, description, imageUrl },
      { new: true }
    );
    if (!updatedAboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    notifyClients("aboutUs", "updated", updatedAboutUs); // Matches eventName: "aboutUs_updated"
    console.log("Emitted aboutUs_updated event with:", updatedAboutUs);
    res.status(200).json({ success: true, data: updatedAboutUs });
  } catch (error) {
    console.error("Error updating About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
// Delete About Us data by ID
export const deleteAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
    if (!aboutUs) {
      return res.status(404).json({ success: false, message: "About Us data not found" });
    }
    notifyClients("aboutUsDeleted", null); // Emit "aboutUsDeleted" event
    res.status(200).json({ success: true, message: "About Us data deleted successfully" });
  } catch (error) {
    console.error("Error deleting About Us data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};