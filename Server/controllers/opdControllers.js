import OPD from "../models/opdModels.js";
import { notifyClients } from "../services/socket.js";

// GET: Fetch all OPD entries, clean legacy fields, and filter out useless records
export const getOPD = async (req, res) => {
  try {
    let opdData = await OPD.find();

    if (!opdData || opdData.length === 0) {
      return res.status(404).json({ success: false, message: "No OPD data found" });
    }

    // Step 1: Remove legacy keys + convert to plain object
    const cleanedData = opdData
      .map(entry => {
        const obj = entry.toObject();
        delete obj.benefits;
        delete obj.technology;
        return obj;
      })
      // Step 2: Filter out entries with empty or missing 'cards' and 'benefit'
      .filter(entry =>
        (Array.isArray(entry.cards) && entry.cards.length > 0) ||
        (Array.isArray(entry.benefit) && entry.benefit.length > 0)
      );

    if (cleanedData.length === 0) {
      return res.status(404).json({ success: false, message: "No valid OPD data found after cleanup" });
    }

    res.status(200).json({ success: true, data: cleanedData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// POST: Create a new OPD entry
export const createOPD = async (req, res) => {
  try {
    const opdData = new OPD(req.body);
    const saved = await opdData.save();
    notifyClients?.("opdUpdated", saved);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create OPD", error: error.message });
  }
};

// PUT: Update an existing OPD entry by ID
export const updateOPD = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await OPD.findByIdAndUpdate(id, req.body, { new: true, upsert: false });

    if (!updated) {
      return res.status(404).json({ success: false, message: "OPD data not found" });
    }

    notifyClients?.("opdUpdated", updated);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update OPD", error: error.message });
  }
};

// DELETE: Remove an OPD entry by ID
export const deleteOPD = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OPD.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "OPD data not found" });
    }

    notifyClients?.("opdUpdated", deleted);
    res.status(200).json({ success: true, message: "OPD entry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete OPD", error: error.message });
  }
};
