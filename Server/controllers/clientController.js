// clientController.js
import ClientSettings from "../models/clientModel.js";
import { notifyClients } from "../services/socket.js";

// Get client settings
export const getClientSettings = async (req, res) => {
  try {
    const settings = await ClientSettings.findOne(); // Assume single document for simplicity
    if (!settings) {
      const newSettings = new ClientSettings();
      await newSettings.save();
      return res.status(200).json(newSettings);
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching client settings", error });
  }
};

// Update client settings (clients and Swiper settings)
export const updateClientSettings = async (req, res) => {
  try {
    const settings = await ClientSettings.findOne();
    if (!settings) {
      const newSettings = new ClientSettings(req.body);
      await newSettings.save();
      notifyClients();
      return res.status(201).json(newSettings);
    }
    Object.assign(settings, req.body);
    await settings.save();
    notifyClients();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error updating client settings", error });
  }
};