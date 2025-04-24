import mongoose from "mongoose";
import { doctorSchema } from "../models/doctorModel.js";
import { notifyClients } from "../services/socket.js";

const Doctor = mongoose.model("Doctor", doctorSchema);

export const getDoctor = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (!doctors.length) return res.status(404).json({ success: false, message: "No doctor data found" });

        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        const saved = await newDoctor.save();
        notifyClients?.("doctorUpdated", saved);

        res.status(201).json({ success: true, data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const updated = await Doctor.findByIdAndUpdate(doctorId, req.body, { new: true, upsert: true });

        if (!updated) return res.status(404).json({ success: false, message: "Doctor not found" });

        notifyClients?.("doctorUpdated", updated);
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const deleted = await Doctor.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Doctor not found" });

        notifyClients?.("doctorUpdated", deleted);
        res.status(200).json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
