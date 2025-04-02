import OurAchievements from "../models/AboutUs/ourachievementsModel.js";
import { notifyClients } from "../services/socket.js";

export const getOurAchievements = async (req, res) => {
    try {
        const data = await OurAchievements.findOne({})
        if (!data) {
            return res.status(404).json({  
                success: false,
                message: 'Our Achievements data not found'
            });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching achievements data:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching achievements data",
            error: error.message
        });
    }
};

// ✅ Create Our Achievements Data
export const createOurAchievements = async (req, res) => {
    try {
        const { title, description, cards } = req.body;

        const newOurAchievements = new OurAchievements({
            title,
            description,
            cards
        });

        const savedOurAchievements = await newOurAchievements.save();
        notifyClients("OurAchievementsUpdated", savedOurAchievements);

        res.status(201).json({ success: true, data: savedOurAchievements });
    } catch (error) {
        console.error("Error creating Our Achievements data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// ✅ Update Our Achievements Data (Now Uses `req.params.id`)
export const updateOurAchievements = async (req, res) => {
    try {
        const { title, description, cards } = req.body;

        const updatedData = await OurAchievements.findByIdAndUpdate(
            req.params.id, 
            { title, description, cards }, 
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ 
                success: false, 
                message: "Our Achievements data not found" 
            });
        }

        notifyClients("OurAchievementsUpdated", updatedData);

        res.status(200).json({
            success: true,
            message: "Our Achievements data updated successfully",
            data: updatedData
        });
    } catch (error) {
        console.error("Error updating Our Achievements data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// ✅ Delete Our Achievements Data (Now Uses `req.params.id`)
export const deleteOurAchievements = async (req, res) => {
    try {
        const deletedData = await OurAchievements.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: "Our Achievements data not found"
            });
        }

        notifyClients?.("OurAchievementsDeleted", null);

        res.status(200).json({
            success: true,
            message: "Our Achievements data deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting Our Achievements data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
