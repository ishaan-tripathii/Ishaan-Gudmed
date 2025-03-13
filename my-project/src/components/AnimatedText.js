import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { FaHospitalAlt, FaPrescription, FaVials, FaCapsules, FaUserMd, FaRobot } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";

const socket = io("http://localhost:5000");

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

  const fetchAnimatedText = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/animated-text");
      setAnimatedText({
        redMarquee: response.data.redMarquee || animatedText.redMarquee,
        blackMarquee: response.data.blackMarquee || animatedText.blackMarquee,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching animated text data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimatedText();
    socket.on("animatedTextUpdated", () => {
      fetchAnimatedText();
      toast.success("Animated text updated in real-time!");
    });
    return () => socket.off("animatedTextUpdated");
  }, []);

  const iconMap = {
    FaHospitalAlt: <FaHospitalAlt />,
    FaPrescription: <FaPrescription className="text-blue-400" />,
    FaVials: <FaVials className="text-green-400" />,
    FaCapsules: <FaCapsules className="text-purple-500" />,
    FaUserMd: <FaUserMd className="text-white" />,
    FaRobot: <FaRobot className="text-yellow-500" />,
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="relative h-64 mt-2 sm:mt-4 md:mt-4 lg:mt-[40rem] xl:mt-[20rem]">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Red background with right-to-left moving text */}
      <div
        className="bg-gradient-to-r from-purple-400 to-red-300 h-12 flex items-center absolute top-4 left-0 w-full p-4"
        style={{
          transform: "rotate(1deg)",
          zIndex: 1,
        }}
      >
        <Marquee speed={60} gradient={false} direction="right" className="hide-scrollbar">
          {animatedText.redMarquee.map((item, index) => (
            <span key={index} className="text-4xl font-bold text-white px-8 flex items-center gap-2">
              {iconMap[item.icon] || <FaRobot className="text-yellow-500" />}
              {item.text}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Black background with left-to-right moving text */}
      <div
        className="bg-[#2E4168] h-12 flex items-center absolute top-20 left-0 w-full"
        style={{
          transform: "rotate(-1deg)",
          zIndex: 0,
        }}
      >
        <Marquee speed={60} gradient={false} direction="left" className="hide-scrollbar">
          {animatedText.blackMarquee.map((item, index) => (
            <span key={index} className="text-4xl font-bold text-white px-8 flex items-center gap-2">
              {iconMap[item.icon] || <FaRobot className="text-yellow-500" />}
              {item.text}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

// Tailwind CSS styles to hide the scrollbar
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