import StepByStep from "../models/stepByStepModel.js";
import { notifyClients } from "../services/socket.js";

// Fetch Step-by-Step Data
export const getStepByStep = async (req, res) => {
  try {
    const data = await StepByStep.findOne();
    if (!data) {
      return res.status(404).json({ message: "No step-by-step data found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching step-by-step data", error });
  }
};

// Create Step-by-Step Data
export const createStepByStep = async (req, res) => {
  try {
    const newData = new StepByStep({
      heading: req.body.heading || "🔧 HOW WE WORKS?",
      subheading: req.body.subheading || "Simplifying Healthcare with GudMed: 🔧",
      description:
        req.body.description ||
        "At GudMed, we believe technology should enhance your work, not complicate it.",
      steps: req.body.steps || [],
    });
    await newData.save();
    notifyClients("step_by_step", "create", newData);
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: "Error creating step-by-step data", error });
  }
};

// Update Step-by-Step Data
export const updateStepByStep = async (req, res) => {
  try {
    const data = await StepByStep.findOne();
    if (!data) {
      return createStepByStep(req, res);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("step_by_step", "update", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating step-by-step data", error });
  }
};

// Delete Step-by-Step Data (entire document)
export const deleteStepByStep = async (req, res) => {
  try {
    const data = await StepByStep.findOneAndDelete();
    if (!data) {
      return res.status(404).json({ message: "No step-by-step data found to delete" });
    }
    notifyClients("step_by_step", "delete", data._id);
    res.status(200).json({ message: "Step-by-step data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting step-by-step data", error });
  }
};