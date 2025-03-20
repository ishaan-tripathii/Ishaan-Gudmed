import ClientSettings from "../models/clientModel.js";
import { notifyClients } from "../services/socket.js";

// Utility to get or create settings
const getOrCreateSettings = async () => {
  let settings = await ClientSettings.findOne({});
  if (!settings) {
    settings = await ClientSettings.create({});
  }
  return settings;
};

// Get client settings
export const getClientSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client settings",
      error: error.message,
    });
  }
};

// Update client settings
export const updateClientSettings = async (req, res) => {
  try {
    const updatedSettings = await ClientSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Backend: Emitting clientSettingsUpdated event", updatedSettings);
    // Wrap the updatedSettings in a data field to match the API response structure
    notifyClients("clientSettingsUpdated", { data: updatedSettings });

    res.status(200).json({
      success: true,
      message: "Client settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating client settings",
      error: error.message,
    });
  }
};