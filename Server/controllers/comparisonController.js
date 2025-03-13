// backend/controllers/comparisonController.js
import Comparison from "../models/comparisonModel.js";
import { notifyClients } from "../services/socket.js";

export const getComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      const newData = new Comparison({ title: "GudMed vs Other Technologies", items: [] });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comparison data", error });
  }
};

export const updateComparison = async (req, res) => {
  try {
    const data = await Comparison.findOne();
    if (!data) {
      const newData = new Comparison(req.body);
      await newData.save();
      notifyClients("comparisonUpdated");
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("comparisonUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating comparison data", error });
  }
};