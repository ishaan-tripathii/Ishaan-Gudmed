import Footer from "../models/footerModel.js";
import { notifyClients } from "../services/socket.js";

// Get Footer Data
export const getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Footer data not found"
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching footer data",
      error: error.message
    });
  }
};

// Create Footer Data
export const createFooter = async (req, res) => {
  try {
    const { copyright, contact, socialIcons, logoUrl } = req.body;

    const newFooter = await Footer.create({
      copyright,
      contact,
      socialIcons,
      logoUrl
    });

    notifyClients("footerCreated", newFooter);

    res.status(201).json({
      success: true,
      message: "Footer created successfully",
      data: newFooter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating footer data",
      error: error.message
    });
  }
};

// Update Footer Data
export const updateFooter = async (req, res) => {
  try {
    const updatedFooter = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });

    notifyClients("footerUpdated", updatedFooter);

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: updatedFooter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating footer data",
      error: error.message
    });
  }
};

// Delete Footer Data
export const deleteFooter = async (req, res) => {
  try {
    const deletedFooter = await Footer.findOneAndDelete({});

    if (!deletedFooter) {
      return res.status(404).json({
        success: false,
        message: "Footer data not found"
      });
    }

    notifyClients("footerDeleted", deletedFooter);

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting footer data",
      error: error.message
    });
  }
};
