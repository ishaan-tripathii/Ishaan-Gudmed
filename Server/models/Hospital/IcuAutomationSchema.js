import mongoose from "mongoose";

const icuAutomationSchema = new mongoose.Schema({
  // Section Data (Global Header)
  title: { type: String, required: true, default: "Revolutionizing ICU Automation with Gudmed" },
  description: {
    type: String,
    required: true,
    default: "Gudmed is transforming Intensive Care Unit (ICU) management with cutting-edge AI solutions designed to improve patient outcomes, streamline workflows, and empower healthcare professionals.",
  },

  // Embedded Array of Automation Features (Cards)
  features: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      imageSrc: { type: String, required: true },
      icon: { type: String, required: true }, // e.g., "FaHeartbeat"
      iconColor: { type: String, default: "#2563EB" },
      iconBgColor: { type: String, default: "#DBEAFE" },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // Document Creation Timestamp
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("IcuAutomation", icuAutomationSchema);