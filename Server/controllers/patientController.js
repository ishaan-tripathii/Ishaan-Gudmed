import mongoose from "mongoose";
import { patientSchema } from "../models/patientModel.js";
import { notifyClients } from "../services/socket.js";

// Create the Patient model
const Patient = mongoose.model("Patient", patientSchema);

// Get Patient Data
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.find();
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient data not found" });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create Patient Data
export const createPatient = async (req, res) => {
  try {
    const {
      heading,
      subheading,
      image,
      button1,
      button2,
      button1colour,
      button2colour,
      buttonUrl1,
      buttonUrl2,
      features
    } = req.body;

    const newPatient = new Patient({
      heading,
      subheading,
      image,
      button1,
      button2,
      button1colour,
      button2colour,
      buttonUrl1,
      buttonUrl2,
      features
    });

    const savedPatient = await newPatient.save();
    notifyClients?.("patientUpdated", savedPatient);
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    console.error("Error creating Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Patient Data
export const updatePatient = async (req, res) => {
  try {
    const {
      heading,
      subheading,
      image,
      button1,
      button2,
      button1colour,
      button2colour,
      buttonUrl1,
      buttonUrl2,
      features
    } = req.body;

    const updatedPatient = await Patient.findOneAndUpdate(
      {},
      {
        heading,
        subheading,
        image,
        button1,
        button2,
        button1colour,
        button2colour,
        buttonUrl1,
        buttonUrl2,
        features
      },
      { new: true, upsert: true }
    );

    notifyClients?.("patientUpdated", updatedPatient);
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error("Error updating Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Patient Data
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({});
    if (!deletedPatient) {
      return res.status(404).json({ success: false, message: "Patient data not found" });
    }

    notifyClients?.("patientDeleted", null);
    res.status(200).json({ success: true, message: "Patient data deleted successfully" });
  } catch (error) {
    console.error("Error deleting Patient data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};