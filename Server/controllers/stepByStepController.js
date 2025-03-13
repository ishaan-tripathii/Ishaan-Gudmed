// backend/controllers/stepByStepController.js
import StepByStep from "../models/stepByStepModel.js";
import { notifyClients } from "../services/socket.js";

export const getStepByStep = async (req, res) => {
  try {
    const data = await StepByStep.findOne();
    if (!data) {
      const newData = new StepByStep({
        heading: "🔧 HOW WE WORKS?",
        subheading: "Simplifying Healthcare with GudMed: 🔧",
        description:
          "At GudMed, we believe technology should enhance your work, not complicate it. Our solution keeps it simple and effective.",
        steps: [
          {
            title: "Step 1",
            description: "Doctors continue to do what they do best—writing prescriptions with pen and paper.",
            icon: "https://example.com/step1-icon.png",
          },
          {
            title: "Step 2",
            description: "Simply scan the handwritten prescription using the GudMed Smart Camera.",
            icon: "https://example.com/step2-icon.png",
          },
          {
            title: "Step 3",
            description: "Press the spacebar, then enter—your digital prescription is ready to go!",
            icon: "https://example.com/step3-icon.png",
          },
        ],
      });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching step-by-step data", error });
  }
};

export const updateStepByStep = async (req, res) => {
  try {
    const data = await StepByStep.findOne();
    if (!data) {
      const newData = new StepByStep(req.body);
      await newData.save();
      notifyClients("stepByStepUpdated");
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("stepByStepUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating step-by-step data", error });
  }
};