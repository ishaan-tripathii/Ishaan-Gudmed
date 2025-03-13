import AnimatedText from "../models/animatedTextModel.js";
import { notifyClients } from "../services/socket.js";

export const getAnimatedText = async (req, res) => {
  try {
    const data = await AnimatedText.findOne();
    if (!data) {
      const newData = new AnimatedText({
        redMarquee: [
          { text: "Faster Discharges = Higher Bed Turnover ⏩", icon: "FaRobot" },
          { text: "Real-Time Digital Prescription 📑", icon: "FaPrescription" },
          { text: "Seamless Lab Services Generate Revenues 💰", icon: "FaVials" },
        ],
        blackMarquee: [
          { text: "Direct Pharmacy Integration for more revenues 💰", icon: "FaCapsules" },
          { text: "Improved OPD Management 🏥", icon: "FaUserMd" },
          { text: "Automated Patient Engagement", icon: "FaRobot" },
        ],
      });
      await newData.save();
      return res.status(200).json(newData);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching animated text data", error });
  }
};

export const updateAnimatedText = async (req, res) => {
  try {
    const data = await AnimatedText.findOne();
    if (!data) {
      const newData = new AnimatedText(req.body);
      await newData.save();
      notifyClients("animatedTextUpdated");
      return res.status(201).json(newData);
    }
    Object.assign(data, req.body);
    await data.save();
    notifyClients("animatedTextUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating animated text data", error });
  }
};