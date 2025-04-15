import GudmedToday from "../models/gudmedtodayModel.js";
// Update the path to the correct location of socket.js
import { notifyClients } from "../../services/socket.js";

// Fetch Gudmed Today data
export const getGudmedToday = async (req, res) => {
    try {
        const data = await GudmedToday.find();
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Gudmed Today data not found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching Gudmed Today data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create Gudmed Today data
export const createGudmedToday = async (req, res) => {
    try {
        const { heading, description, cards, future } = req.body;

        const newGudmedToday = new GudmedToday({
            heading,
            description,
            cards,
            future
        });

        const savedGudmedToday = await newGudmedToday.save();
        notifyClients?.("gudmedTodayUpdated", savedGudmedToday);

        res.status(201).json({ success: true, data: savedGudmedToday });
    } catch (error) {
        console.error("Error creating Gudmed Today data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Gudmed Today data
export const updateGudmedToday = async (req, res) => {
    try {
        const { heading, description, cards, future } = req.body;

        // Step 1: Check if document exists
        const exists = await GudmedToday.findById(req.params.id);
        if (!exists) {
            console.log("Document doesn't exist. Wrong ID:", req.params.id);
            return res.status(404).json({ success: false, message: "Document doesn't exist. Wrong ID?" });
        }

        // Step 2: Proceed to update
        const updatedGudmedToday = await GudmedToday.findByIdAndUpdate(
            req.params.id,
            { heading, description, cards, future },
            { new: true }
        );

        notifyClients?.("gudmedTodayUpdated", updatedGudmedToday);
        res.status(200).json({ success: true, data: updatedGudmedToday });
    } catch (error) {
        console.error("Error updating Gudmed Today data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Gudmed Today data
export const deleteGudmedToday = async (req, res) => {
    try {
        const deletedData = await GudmedToday.findByIdAndDelete(req.params.id);

        if (!deletedData) {
            return res.status(404).json({ success: false, message: "Gudmed Today data not found" });
        }

        notifyClients?.("gudmedTodayUpdated", null); // Notify clients on deletion
        res.status(200).json({ success: true, message: "Gudmed Today data deleted successfully" });
    } catch (error) {
        console.error("Error deleting Gudmed Today data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

