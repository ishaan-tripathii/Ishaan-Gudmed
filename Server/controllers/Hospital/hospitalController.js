import Hospital from "../../models/Hospital/Hospital.js";
import { notifyClients } from "../../services/socket.js";

// Get all hospital data
export const getHospitalData = async (req, res) => {
  try {
    const hospitalData = await Hospital.find();
    res.status(200).json({ success: true, data: hospitalData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new hospital data
export const createHospitalData = async (req, res) => {
  try {
    const newData = new Hospital(req.body);
    const savedData = await newData.save();
    notifyClients("hospital", "create", savedData);
    res.status(201).json({ success: true, data: savedData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update hospital data by ID
export const updateHospitalData = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id; // Prevent _id from being updated
    const updatedData = await Hospital.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedData) {
      return res.status(404).json({ success: false, message: "Hospital data not found" });
    }
    notifyClients("hospital", "update", updatedData);
    res.status(200).json({ success: true, data: updatedData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete hospital data by ID
export const deleteHospitalData = async (req, res) => {
  try {
    const deletedData = await Hospital.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ success: false, message: "Hospital data not found" });
    }
    notifyClients("hospital", "delete", { id: req.params.id });
    res.status(200).json({ success: true, message: "Hospital data deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};