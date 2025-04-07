import ThirdSection from "../models/AboutUs/thirdsectionModel.js";
import { notifyClients } from "../services/socket.js";

//Get Third Section Data (Single Document)
export const getThirdSection = async (req, res) => {
  try {
    const data = await ThirdSection.findOne(); // Fetch the single document
    if (!data) {
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching Third Section data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//Create Third Section Data (Only if none exists)
export const createThirdSection = async (req, res) => {
  try {
    const { heading, description } = req.body;

    // Check if a document already exists
    const existing = await ThirdSection.findOne();
    if (existing) {
      return res.status(400).json({ success: false, message: "Third Section already exists. Use update instead." });
    }

    const newThirdSection = new ThirdSection({
      heading,
      description,
    });

    const savedThirdSection = await newThirdSection.save();
    notifyClients("third_section_created", savedThirdSection); // Correct event name

    res.status(201).json({ success: true, data: savedThirdSection });
  } catch (error) {
    console.error("Error creating Third Section data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//Update Third Section Data (Update the single document)
export const updateThirdSection = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { heading, description } = req.body;

    console.log("Updating ThirdSection with ID:", id); // Debug log

    const updatedThirdSection = await ThirdSection.findByIdAndUpdate(
      id,
      { heading, description },
      { new: true, runValidators: true }
    );

    if (!updatedThirdSection) {
      console.log("No document found for ID:", id); // Debug log
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }

    console.log("Updated ThirdSection:", updatedThirdSection); // Debug log
    notifyClients("third_section_updated", updatedThirdSection); // Notify clients

    res.status(200).json({ success: true, data: updatedThirdSection });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//Delete Third Section Data
export const deleteThirdSection = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL

    const deletedData = await ThirdSection.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }

    notifyClients("third_section_deleted", null); // Notify clients
    res.status(200).json({ success: true, message: "Third Section data deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
