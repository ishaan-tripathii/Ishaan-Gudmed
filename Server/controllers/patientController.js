import mongoose from "mongoose";
import { patientSchema } from "../models/patientModel.js";
import { notifyClients } from "../services/socket.js";

// Create the Patient model
const Patient = mongoose.model("Patient", patientSchema);

// ✅ Get Patient data (Updated)
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne(); // Fetch a specific patient
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient data not found" });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Create Patient data
export const createPatient = async (req, res) => {
  try {
    const { heading, subheading, image, button, content } = req.body;
    const newPatient = new Patient({ heading, subheading, image, button, content });
    const savedPatient = await newPatient.save();
    notifyClients?.("patientUpdated", savedPatient);
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    console.error("Error creating Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update Patient data
export const updatePatient = async (req, res) => {
  try {
    const { heading, subheading, image, button, content } = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { heading, subheading, image, button, content },
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: "Patient data not found" });
    }
    notifyClients?.("patientUpdated", updatedPatient);
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error("Error updating Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete Patient data
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient data not found" });
    }
    notifyClients?.("patientUpdated", null);
    res.status(200).json({ success: true, message: "Patient data deleted successfully" });
  } catch (error) {
    console.error("Error deleting Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
