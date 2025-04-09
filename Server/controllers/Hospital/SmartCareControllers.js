import SmartCare from "../../models/Hospital/SmartCareModele.js";
import { notifyClients } from "../../services/socket.js";

// GET all SmartCare data
export const getSmartCareData = async (req, res) => {
  try {
    const smartCareData = await SmartCare.findOne();
    res.status(200).json({ success: true, data: smartCareData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new SmartCare data
export const createSmartCareData = async (req, res) => {
  try {
    const newData = await SmartCare.create(req.body); // Corrected here
    notifyClients ("smartCareData", "create", newData);
    res.status(201).json({ success: true, data: newData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE SmartCare data by ID
export const updateSmartCareData = async (req, res) => {
  try {
    const updatedData = await SmartCare.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated document
    );
    if (!updatedData) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }
    notifyClients ("smartCareData", "update", updatedData);
    res.status(200).json({ success: true, data: updatedData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE SmartCare data by ID
export const deleteSmartCareData = async (req, res) => {
  try {
    const deletedData = await SmartCare.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }
    notifyClients ("smartCareData", "delete", deletedData);
    res.status(200).json({ success: true, message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
