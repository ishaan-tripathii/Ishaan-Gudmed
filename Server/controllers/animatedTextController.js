// controllers/animatedTextController.js
import AnimatedText from "../models/animatedTextModel.js";
import { notifyClients } from "../services/socket.js";

// Fetch or Initialize Animated Text Data
export const getAnimatedText = async (req, res) => {
  try {
    let data = await AnimatedText.findOne();
    if (!data) {
      data = await AnimatedText.create({
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
      console.log("Created default animated text:", data);
      notifyClients("animatedText", "created", data);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching animated text data:", error);
    res.status(500).json({ message: "Error fetching animated text data", error: error.message });
  }
};

// Update Animated Text Data
export const updateAnimatedText = async (req, res) => {
  try {
    const data = await AnimatedText.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    console.log("Updated animated text:", data);
    notifyClients("animatedText", "updated", data); // Consistent naming
    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating animated text data:", error);
    res.status(500).json({ message: "Error updating animated text data", error: error.message });
  }
};