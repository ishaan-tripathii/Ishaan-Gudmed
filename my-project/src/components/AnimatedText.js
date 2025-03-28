// src/components/AnimatedText.jsx
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import * as FaIcons from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import config from "../config/config"; // Updated path to the config file

// Use the dynamic configuration for API and Socket.IO
const API_BASE_URL = config.apiBaseUrl;
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const AnimatedText = () => {
  const [animatedText, setAnimatedText] = useState({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const fetchAnimatedText = async () => {
      try {
        const response = await api.get("/animated-text");
        console.log("Fetched animated text (user):", response.data);
        setAnimatedText({
          redMarquee: response.data.redMarquee || animatedText.redMarquee,
          blackMarquee: response.data.blackMarquee || animatedText.blackMarquee,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching animated text:", err);
        setError("Failed to load animated text");
        setLoading(false);
      }
    };

    fetchAnimatedText();

    socket.on("connect", () => {
      console.log("Socket.IO connected (user):", socket.id);
    });

    socket.on("animatedText_updated", (updatedData) => {
      console.log("Received animatedText_updated (user):", updatedData);
      setAnimatedText({
        redMarquee: updatedData.redMarquee,
        blackMarquee: updatedData.blackMarquee,
      });
      toast.success("Animated text updated in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      console.log("Socket.IO disconnected (user)");
    };
  }, []);

  const iconStyles = {
    FaPrescription: "text-blue-400",
    FaVials: "text-green-400",
    FaCapsules: "text-purple-500",
    FaUserMd: "text-white",
    FaRobot: "text-yellow-500",
  };

  const renderIcon = (iconName) => {
    if (!iconName) return null;
    const IconComponent = FaIcons[iconName];
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in react-icons/fa`);
      return null;
    }
    const className = iconStyles[iconName] || "text-white";
    return <IconComponent className={className} />;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="relative h-64 mt-2 sm:mt-4 md:mt-4 lg:mt-[40rem] xl:mt-[20rem]">
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className="bg-gradient-to-r from-purple-400 to-red-300 h-12 flex items-center absolute top-4 left-0 w-full p-4"
        style={{ transform: "rotate(1deg)", zIndex: 1 }}
      >
        <Marquee speed={60} gradient={false} direction="right" className="hide-scrollbar">
          {animatedText.redMarquee.map((item, index) => (
            <span key={index} className="text-4xl font-bold text-white px-8 flex items-center gap-2">
              {renderIcon(item.icon)}
              {item.text}
            </span>
          ))}
        </Marquee>
      </div>

      <div
        className="bg-[#2E4168] h-12 flex items-center absolute top-20 left-0 w-full"
        style={{ transform: "rotate(-1deg)", zIndex: 0 }}
      >
        <Marquee speed={60} gradient={false} direction="left" className="hide-scrollbar">
          {animatedText.blackMarquee.map((item, index) => (
            <span key={index} className="text-4xl font-bold text-white px-8 flex items-center gap-2">
              {renderIcon(item.icon)}
              {item.text}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default AnimatedText;