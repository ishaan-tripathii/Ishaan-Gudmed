import CameraBenefit from '../models/smartCameraModel.js';
import { notifyClients } from '../services/socket.js';

// Get Smart Camera data
export const getSmartCamera = async (req, res) => {
    try {
        const smartCamera = await CameraBenefit.find(); // Fetch data from the database

        if (!smartCamera || smartCamera.length === 0) {
            return res.status(404).json({ success: false, message: "Smart Camera data not found" });
        }

        res.status(200).json({ success: true, data: smartCamera });
    } catch (error) {
        console.error("Error fetching Smart Camera Data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create Smart Camera data
export const createSmartCamera = async (req, res) => {
    try {
        const { heading, image, icon, content, cards } = req.body;

        const newsmartCamera = new CameraBenefit({
            heading,
            image,
            icon,
            content,
            cards
        });

        const savedSmartCamera = await newsmartCamera.save(); // Corrected save syntax
        notifyClients("smartCameraUpdated", savedSmartCamera);

        res.status(201).json({ success: true, data: savedSmartCamera });
    } catch (error) {
        console.error("Error creating Smart Camera data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Smart Camera Data
export const updateSmartCamera = async (req, res) => {
    try {
        const { heading, image, icon, content, cards } = req.body;

        const updatedSmartCamera = await CameraBenefit.findOneAndUpdate(
            {},
            { heading, image, icon, content, cards },
            { new: true, upsert: true }
        );

        notifyClients("smartCameraUpdated", updatedSmartCamera);
        res.status(200).json({ success: true, data: updatedSmartCamera });
    } catch (error) {
        console.error("Error updating Smart Camera data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Smart Camera Data
export const deleteSmartCamera = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSmartCamera = await CameraBenefit.findByIdAndDelete(id);

        if (!deletedSmartCamera) {
            return res.status(404).json({ success: false, message: "Smart Camera data not found" });
        }

        notifyClients("smartCameraDeleted", { id });

        res.status(200).json({ success: true, message: "Smart Camera data deleted successfully" });
    } catch (error) {
        console.error("Error deleting Smart Camera data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};






