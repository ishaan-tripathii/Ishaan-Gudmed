import ThirdSection from "../models/AboutUs/thirdsectionModel.js";
import { notifyClients } from "../services/socket.js";

// ✅ Get Third Section Data
export const getThirdSection = async (req, res) => {
  try {
    const data = await ThirdSection.findOne(); // Fetch existing data

    if (!data) {
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching Third Section data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Create Third Section Data
export const createThirdSection = async (req, res) => {
  try {
    const { heading, description } = req.body;

    const newThirdSection = new ThirdSection({
      heading,
      description,
    });

    const savedThirdSection = await newThirdSection.save();
    notifyClients("ThirdSectionUpdated", savedThirdSection); // Notify clients via WebSocket

    res.status(201).json({ success: true, data: savedThirdSection });
  } catch (error) {
    console.error("Error creating Third Section data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update Third Section Data
export const updateThirdSection = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get ID from URL
    const { heading, description } = req.body;

    const updatedThirdSection = await ThirdSection.findByIdAndUpdate(
      id, // ✅ Find by ID
      { heading, description },
      { new: true, runValidators: true }
    );

    if (!updatedThirdSection) {
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }

    res.status(200).json({ success: true, data: updatedThirdSection });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// ✅ Delete Third Section Data
export const deleteThirdSection = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get ID from URL

    const deletedData = await ThirdSection.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ success: false, message: "Third Section data not found" });
    }

    res.status(200).json({ success: true, message: "Third Section data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
