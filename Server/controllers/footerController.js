import Footer from "../models/footerModel.js";
import { notifyClients } from "../services/socket.js";

export const getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    if (!data) {
      const newData = new Footer({
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
        logoUrl: "http://localhost:5000/images/gudmed-logo.png",
      });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching footer data", error });
  }
};

export const updateFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    if (!data) {
      const newData = new Footer(req.body);
      await newData.save();
      notifyClients("footerUpdated");
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("footerUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating footer data", error });
  }
};