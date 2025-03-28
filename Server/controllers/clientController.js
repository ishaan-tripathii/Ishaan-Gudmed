import ClientSettings from "../models/clientModel.js";
import { notifyClients } from "../services/socket.js";

// Utility to get or create settings
const getOrCreateSettings = async () => {
  let settings = await ClientSettings.findOne({});
  if (!settings) {
    settings = await ClientSettings.create({
      clients: [],
      swiperSettings: {
        slidesPerView: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
        slidesPerGroup: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
      },
    });
  }
  return settings;
};

// Get client settings
export const getClientSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching client settings:", error);
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

    console.log("Backend: Emitting clientSettings_updated event:", updatedSettings);
    notifyClients("clientSettings", "updated", updatedSettings);

    res.status(200).json({
      success: true,
      message: "Client settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating client settings:", error);
    res.status(500).json({
      success: false,
      message: "Error updating client settings",
      error: error.message,
    });
  }
};