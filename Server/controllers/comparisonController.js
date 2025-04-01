// backend/controllers/comparisonController.js
import Comparison from "../models/comparisonModel.js";
import { notifyClients } from "../services/socket.js";

// ✅ Fetch Comparison Data
export const getComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      const newData = await createComparison();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comparison data", error });
  }
};

// ✅ Create Comparison Data
export const createComparison = async (req, res) => {
  try {
    const newData = new Comparison({
      title: "GudMed vs Other Technologies",
      items: req.body.items || []
    });
    await newData.save();
    notifyClients("comparisonCreated");
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: "Error creating comparison data", error });
  }
};

// ✅ Update Comparison Data
export const updateComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      return createComparison(req, res); // If no data, create new entry
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("comparisonUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating comparison data", error });
  }
};

// ✅ Delete Comparison Data
// Optional: Add this to comparisonController.js if you want a specific endpoint
export const deleteComparisonItem = async (req, res) => {
  try {
    const { itemIndex } = req.body; // Expecting the index of the item to delete
    const data = await Comparison.findOne();
    if (!data) {
      return res.status(404).json({ message: "No comparison data found" });
    }
    if (itemIndex < 0 || itemIndex >= data.items.length) {
      return res.status(400).json({ message: "Invalid item index" });
    }
    data.items.splice(itemIndex, 1); // Remove the item at the specified index
    await data.save();
    notifyClients("comparisonUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting comparison item", error });
  }
};