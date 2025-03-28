import Comparison from "../models/comparisonModel.js";
import { notifyClients } from "../services/socket.js";

// Fetch Comparison Data
export const getComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      const newData = await createComparison(); // No req.body here, use default
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching comparison data:", error);
    res.status(500).json({ message: "Error fetching comparison data", error: error.message });
  }
};

// Create Comparison Data
export const createComparison = async (req, res) => {
  try {
    const newData = new Comparison({
      title: req.body.title || "GudMed vs Other Technologies",
      items: req.body.items || [],
    });
    await newData.save();
    notifyClients("comparison", "created", newData);
    if (res) {
      res.status(201).json(newData);
    }
    return newData;
  } catch (error) {
    console.error("Error creating comparison data:", error);
    if (res) {
      res.status(500).json({ message: "Error creating comparison data", error: error.message });
    }
    throw error;
  }
};

// Update Comparison Data
export const updateComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      return createComparison(req, res);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("comparison", "updated", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating comparison data:", error);
    res.status(500).json({ message: "Error updating comparison data", error: error.message });
  }
};

// Delete Comparison Item
export const deleteComparisonItem = async (req, res) => {
  try {
    const { itemIndex } = req.body;
    const data = await Comparison.findOne();
    if (!data) {
      return res.status(404).json({ message: "No comparison data found" });
    }
    if (itemIndex < 0 || itemIndex >= data.items.length) {
      return res.status(400).json({ message: "Invalid item index" });
    }
    data.items.splice(itemIndex, 1);
    await data.save();
    notifyClients("comparison", "updated", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error deleting comparison item:", error);
    res.status(500).json({ message: "Error deleting comparison item", error: error.message });
  }
};