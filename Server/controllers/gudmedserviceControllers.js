import gudmedSmartHospital from "../models/gudmedserviceModel.js"; // Ensure correct import
import { notifyClients } from "../services/socket.js";

// Get GudMed services data
export const getgudmedServices = async (req, res) => {
    try {
        const gudmedServices = await gudmedSmartHospital.find();
        if (!gudmedServices || gudmedServices.length === 0) {
            return res.status(404).json({ success: false, message: "GudMed services data not found" });
        }
        res.status(200).json({ success: true, data: gudmedServices });
    } catch (error) {
        console.error("Error fetching GudMed Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create GudMed services
export const creategudmedServices = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // ✅ Log incoming data

        const { title, description, features, image } = req.body;

        // ✅ Validate request
        if (!title || !description || !Array.isArray(features) || features.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required, and features must be a non-empty array." 
            });
        }

        // ✅ Validate each feature
        for (const feature of features) {
            if (!feature.heading || !feature.description) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Each feature must include 'heading' and 'description'." 
                });
            }
        }

        const newGudmedServices = new gudmedSmartHospital({
            title,
            description,
            features,
            image
        });

        const savedGudmedServices = await newGudmedServices.save();
        notifyClients("gudmedServicesUpdated", savedGudmedServices);

        res.status(201).json({ success: true, data: savedGudmedServices });
    } catch (error) {
        console.error("Error creating GudMed Services data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// Update GudMed services
export const updategudmedServices = async (req, res) => {
    try {
        const { id } = req.params;  
        const { title, description, features, image } = req.body;

        // Validate required fields
        if (!title || !description || !features || !Array.isArray(features) || features.length === 0) {
            return res.status(400).json({ success: false, message: "All fields are required, and features must be a non-empty array." });
        }

        // Validate that each feature has both heading and description
        for (const feature of features) {
            if (!feature.heading || !feature.description) {
                return res.status(400).json({ success: false, message: "Each feature must have a heading and description." });
            }
        }

        const updatedService = await gudmedSmartHospital.findByIdAndUpdate(
            id,
            { title, description, features, image },
            { new: true, runValidators: true } 
        );

        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        notifyClients("gudmedServicesUpdated", updatedService);
        res.status(200).json({ success: true, message: "Service updated successfully", data: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete GudMed service
export const deletegudmedServices = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedService = await gudmedSmartHospital.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        notifyClients("gudmedServicesDeleted", null);
        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
