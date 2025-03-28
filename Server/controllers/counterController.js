// backend/controllers/counterController.js
import Counter from "../models/counterModel.js";
import { notifyClients } from "../services/socket.js";

export const getCounter = async (req, res) => {
  try {
    const data = await Counter.findOne();
    if (!data) {
      const newData = new Counter({
        title: "Our Impact",
        items: [
          { label: "Prescriptions Served", number: 2650627, icon: "" },
          { label: "Hindi Prescriptions Served", number: 877645, icon: "" },
          { label: "Doctors With Us", number: 3850, icon: "" },
          { label: "Happy Patients", number: 180000, icon: "" },
        ],
      });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching counter data", error });
  }
};

export const updateCounter = async (req, res) => {
  try {
    const data = await Counter.findOne();
    if (!data) {
      const newData = new Counter(req.body);
      await newData.save();
      notifyClients("counter", "updated", newData); // Use componentType and eventType
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("counter", "updated", data); // Use componentType and eventType
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating counter data", error });
  }
};