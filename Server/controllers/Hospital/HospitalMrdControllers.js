import DigitalHospital from "../../models/Hospital/HospitalMrdSchema.js";
import { notifyClients } from "../../services/socket.js";

// Get Digital Hospital Data 

export const getDigitalHospital = async(req, res) => {
    try {
        const digitalHospital = await DigitalHospital.find();
        if (!digitalHospital) {
            return res.status(404).json({ success: false, message: "Digital Hospital data not found" })
        }
        res.status(200).json({ success: true, data: digitalHospital })
    }
    catch (error) {
        console.error("Error fetching Digital Hospital data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create Digital Hospital Data
export const createDigitalHospital = async(req, res) => {
    try {
        const { heading, description, image, features } = req.body;

        const newDigitalHospital = new DigitalHospital({
            heading,
            description,
            image,
            features
        });

        const savedDigitalHospital = await newDigitalHospital.save();
        notifyClients?.("digitalHospitalUpdated", savedDigitalHospital);
        res.status(201).json({ success: true, data: savedDigitalHospital });
    }
    catch (error) {
        console.error("Error creating Digital Hospital data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message })
    }
};

// Update Digital Hospital Data
export const updateDigitalHospital = async(req, res) => {
    try {
        const { heading, description, image, features } = req.body;
        
        const updatedDigitalHospital = await DigitalHospital.findByIdAndUpdate(
            req.params.id,
            { heading, description, image, features },
            { new: true },
        );
        notifyClients?.("digitalHospitalUpdated", updatedDigitalHospital);
        res.status(200).json({ success: true, data: updatedDigitalHospital });
} catch (error) {
    console.eror("Error updating Digital Hospital data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
}
};

//Delete Digital Hospital Data
export const deleteDigitalHospital = async( req, res ) => {
    try {
        const deleteDigitalHospital = await DigitalHospital.findByIdAndUpdate(req.params.id);
        if (!deleteDigitalHospital) {
            return res.status(404).json({ success: false, message: "Digital Hospital data not found" });
        }
        notifyClients?.("digitalHospitalUpdated", deleteDigitalHospital);
        res.status(200).json({ success: true, message: "Digital Hospital data deleted successfully"});
    }
    catch (error) {
        console.error("Error deleting Digital Hospital data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
