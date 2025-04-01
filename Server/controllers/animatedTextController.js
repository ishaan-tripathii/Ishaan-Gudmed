import AnimatedText from "../models/animatedTextModel.js";
import { notifyClients } from "../services/socket.js";

// Fetch or Initialize Animated Text Data
export const getAnimatedText = async (req, res) => {
  try {
    const data = await AnimatedText.findOne() || await AnimatedText.create({
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

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching animated text data", error });
  }
};

// Update Animated Text Data
export const updateAnimatedText = async (req, res) => {
  try {
    const data = await AnimatedText.findOneAndUpdate({}, req.body, { 
      new: true, // Returns updated data
      upsert: true // Creates new entry if none exists
    });

    notifyClients("animatedTextUpdated");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating animated text data", error });
  }
};
