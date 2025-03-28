import Footer from "../models/footerModel.js";
import { notifyClients } from "../services/socket.js";

// Get Footer Data
export const getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    if (!data) {
      const defaultFooter = await Footer.create({
        copyright: {
          year: 2025,
          companyName: "Gud Medicare Solutions Private Limited",
          rightsReserved: "All rights reserved ®",
        },
        contact: {
          phone: "+91-9999196828",
          email: "cs@gudmed.in",
        },
        socialIcons: [
          { iconClass: "fab fa-whatsapp", link: "https://wa.me/919999196828" },
          { iconClass: "fab fa-facebook-f", link: "https://www.facebook.com/GudMedicare/" },
          { iconClass: "fab fa-twitter", link: "https://x.com/GudMedicare" },
          { iconClass: "fab fa-instagram", link: "https://www.instagram.com/gudmedicare/" },
          { iconClass: "fab fa-youtube", link: "https://www.youtube.com/channel/UC2qkjYWuIsmEuQ5dnMV3l9Q" },
          { iconClass: "fab fa-linkedin", link: "https://www.linkedin.com/company/gudmed/" },
        ],
        logoUrl: "https://gudmed.in/static/media/Gudmed1-removebg-preview.35f892b86290e3dc089a.png",
      });
      notifyClients("footer", "created", defaultFooter);
      return res.status(200).json(defaultFooter);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching footer data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching footer data",
      error: error.message,
    });
  }
};

// Create Footer Data
export const createFooter = async (req, res) => {
  try {
    const existingFooter = await Footer.findOne();
    if (existingFooter) {
      return res.status(400).json({
        success: false,
        message: "Footer data already exists. Use update instead.",
      });
    }

    const { copyright, contact, socialIcons, logoUrl } = req.body;
    const newFooter = await Footer.create({
      copyright,
      contact,
      socialIcons,
      logoUrl,
    });

    notifyClients("footer", "created", newFooter);

    res.status(201).json({
      success: true,
      message: "Footer created successfully",
      data: newFooter,
    });
  } catch (error) {
    console.error("Error creating footer data:", error);
    res.status(500).json({
      success: false,
      message: "Error creating footer data",
      error: error.message,
    });
  }
};

// Update Footer Data
export const updateFooter = async (req, res) => {
  try {
    const updatedFooter = await Footer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    notifyClients("footer", "updated", updatedFooter);

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: updatedFooter,
    });
  } catch (error) {
    console.error("Error updating footer data:", error);
    res.status(500).json({
      success: false,
      message: "Error updating footer data",
      error: error.message,
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
        message: "Footer data not found",
      });
    }

    notifyClients("footer", "deleted", { _id: deletedFooter._id });

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting footer data:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting footer data",
      error: error.message,
    });
  }
};