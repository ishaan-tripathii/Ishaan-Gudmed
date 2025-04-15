import mongoose from "mongoose";
import gudmedHealthcare from "../../models/Hospital/gudmedhealthcareModel.js";
import { notifyClients } from "../../services/socket.js"; // Ensure correct path

//Get Gudmed Healthcare Data

export const getGudmedHealthcare = async (req, res) => {
    try {
        const gudmedHealthcareData = await gudmedHealthcare.find();
        if (!gudmedHealthcareData || gudmedHealthcareData.length === 0) {
            return res.status(404).json({ success: false, message: "Gudmed Healthcare data not found" });
        }
        res.status(200).json({ success: true, data: gudmedHealthcareData });            
    } catch (error) {
        console.error("Error fetching Gudmed Healthcare data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

//Create Gudmed Healthcare Data

export const createGudmedHealthcare = async (req, res) => {
    try {
        const { heading, cards, features } = req.body;

        const newGudmedHealthcare = new gudmedHealthcare({
            heading,
            cards,
            features
        });

        const savedGudmedHealthcare = await newGudmedHealthcare.save();
        notifyClients?.("gudmedHealthcareUpdated", savedGudmedHealthcare);
        res.status(201).json({ success: true, data: savedGudmedHealthcare });
    }

    catch (error) {
        console.error("Error creating Gudmed Healthcare data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//Update Gudmed Healthcare Data

export const updateGudmedHealthcare = async (req, res) => {
    try {
        const { heading, cards, features } = req.body;

        const updatedGudmedHealthcare = await gudmedHealthcare.findByIdAndUpdate(
            req.params.id,
            { heading, cards, features },
            { new: true },
        );
        notifyClients?.("gudmedHealthcareUpdated", updatedGudmedHealthcare);
        res.status(200).json({ success: true, data: updatedGudmedHealthcare });
    }
    catch (error) {
        console.error("Error updating Gudmed Healthcare data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//Delete Gudmed Healthcare Data

export const deleteGudmedHealthcare = async (req, res) => {
    try {
        const deleteGudmedHealthcare = await gudmedHealthcare.findByIdAndDelete(req.params.id);
        if (!deleteGudmedHealthcare) {
            return res.status(404).json({ success: false, message: "Gudmed Healthcare data not found" });
        }
        notifyClients?.("gudmedHealthcareDeleted", null);

        res.status(200).json({ success: true, message: "Gudmed Healthcare data deleted successfully" });
    }

    catch (error) {
        console.error("Error deleting Gudmed Healthcare data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};