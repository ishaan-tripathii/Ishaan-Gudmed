import IcuAutomation from "../../models/Hospital/IcuAutomationSchema.js";
import { notifyClients } from "../../services/socket.js";

export const getIcuAutomationData = async (req, res) => {
  try {
    const data = await IcuAutomation.findOne();
    if (!data) {
      return res.status(404).json({ message: "No ICU automation data found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIcuAutomationData = async (req, res) => {
  try {
    let data = await IcuAutomation.findOne();
    if (!data) {
      data = new IcuAutomation({ features: [req.body] });
    } else {
      data.features.push(req.body);
    }
    const savedData = await data.save();
    notifyClients("icuAutomation", "create", savedData);
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateIcuAutomationData = async (req, res) => {
  try {
    const { featureId } = req.params; // Get featureId from URL parameter
    const updateData = req.body; // Get updated feature data from request body
    console.log("Update Request - featureId:", featureId, "updateData:", updateData); // Debug log

    const data = await IcuAutomation.findOne();
    console.log("Database data:", data); // Debug log
    if (!data) return res.status(404).json({ message: "Data not found" });

    const featureIndex = data.features.findIndex((f) => f._id.toString() === featureId);
    console.log("Feature Index:", featureIndex); // Debug log
    if (featureIndex === -1) return res.status(404).json({ message: "Feature not found" });

    // Preserve the _id of the feature being updated
    data.features[featureIndex] = { ...data.features[featureIndex], ...updateData, _id: data.features[featureIndex]._id };
    const updatedData = await data.save();
    notifyClients("icuAutomation", "update", updatedData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.log("Update Error:", error.message); // Debug log
    res.status(400).json({ message: error.message });
  }
};

export const deleteIcuAutomationData = async (req, res) => {
  try {
    const { featureId } = req.params; // featureId passed in URL
    const data = await IcuAutomation.findOne();
    if (!data) return res.status(404).json({ message: "Data not found" });

    data.features = data.features.filter((f) => f._id.toString() !== featureId);
    const updatedData = await data.save();
    notifyClients("icuAutomation", "delete", { id: featureId });
    res.status(200).json({ message: "Feature deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSectionData = async (req, res) => {
  try {
    const data = await IcuAutomation.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    notifyClients("icuAutomation", "update", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};