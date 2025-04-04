import { Service } from '../models/servicesModel.js'; // Ensure the correct path
import { notifyClients } from "../services/socket.js"; // Ensure correct path

// Get Services Data
export const getOurServices = async (req, res) => {
    try {
        const ourServices = await Service.findOne({});
        if (!ourServices) {
            return res.status(404).json({ success: false, message: "Our Services data not found" });
        }
        res.status(200).json({ success: true, data: ourServices });
    } catch (error) {
        console.error("Error fetching Our Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create Our Services
export const createOurServices = async (req, res) => {
    try {
        const { heading, description, cards, works } = req.body;

        const newOurServices = new Service({
            heading,
            description,
            cards,
            works
        });

        const savedOurServices = await newOurServices.save();
        notifyClients("OurServicesUpdated", savedOurServices);

        res.status(201).json({ success: true, data: savedOurServices });
    } catch (error) {
        console.error("Error creating Our Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// Update Our Services
export const updateOurServices = async (req, res) => {
    try {
        const { heading, description, cards, works } = req.body;

        const updatedOurServices = await Service.findOneAndUpdate(
            {},
            { heading, description, cards, works },
            { new: true, upsert: true }
        );

        notifyClients("OurServicesUpdated", updatedOurServices);
        res.status(200).json({ success: true, data: updatedOurServices });
    } catch (error) {
        console.error("Error updating Our Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Our Services
export const deleteOurServices = async (req, res) => {
    try {
        const ourServices = await Service.findOneAndDelete({});
        if (!ourServices) {
            return res.status(404).json({ success: false, message: "Our Services data not found" });
        }

        notifyClients("OurServicesDeleted", null); 
        res.status(200).json({ success: true, message: "Our Services data deleted successfully" });
    } catch (error) {
        console.error("Error deleting Our Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


