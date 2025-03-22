import React, { useState, useEffect } from "react";
import { FaHospital, FaRobot, FaChartBar, FaRegPaperPlane, FaHeartbeat, FaMedkit, FaClipboardCheck } from "react-icons/fa";
import { FiSettings, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { ENDPOINTS, config } from "../utils/api";

// Create socket connection using the configured URL
const socket = io(config.SOCKET_URL);

const iconMap = {
  FaHospital,
  FaChartBar,
  FiSettings,
  FiActivity,
  FaRegPaperPlane,
  FaRobot,
  FaHeartbeat,
  FaMedkit,
  FaClipboardCheck,
};

const HighlightCard = ({ icon, title, description }) => {
  const Icon = iconMap[icon] || FaChartBar;
  return (
    <div className="bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out p-6 rounded-xl flex flex-col items-center border border-gray-200 hover:border-blue-300">
      {icon && <Icon className="text-blue-500 text-5xl mb-4" />}
      {title && <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 text-center">{description}</p>}
    </div>
  );
};

const MotionCard = ({ icon, color, title, description }) => {
  const Icon = iconMap[icon] || FaRobot;
  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {icon && (
        <div
          className="flex items-center justify-center mb-6 p-4 rounded-full"
          style={{ backgroundColor: color || "#E5E7EB" }}
        >
          <Icon className="text-white text-5xl" />
        </div>
      )}
      {title && <h4 className="text-2xl font-semibold text-[#2E4168] mb-4">{title}</h4>}
      {description && <p className="text-[#2E4168] text-base font-medium">{description}</p>}
    </motion.div>
  );
};

const AiPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get(ENDPOINTS.AI_PAGES.LIST);
      console.log('AI Page data:', response.data);
      setData(response.data.data[0] || null);
      setError(null);
    } catch (err) {
      console.error("Error fetching AI page data:", err);
      setError(err.message);
      toast.error('Failed to load AI page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
    });

    socket.on("contentUpdated", (update) => {
      if (update.type === "ai" && update.data?.length > 0) {
        setData(update.data[0]);
        toast.success("AI page updated!");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setError(`Socket.IO connection failed`);
    });

    return () => {
      socket.off("contentUpdated");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12 bg-white">
        <p className="text-red-500 text-lg">Error loading AI page content: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12 bg-white">
        <p className="text-gray-500 text-lg">AI page content is not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6">
      <ToastContainer />
      <div className="text-center mb-6 -mt-12 md:-mt-6">
        <h1
          className="text-4xl font-bold text-[#2E4168] relative inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text leading-normal"
          style={{ color: data?.titleColor || '#2E4168' }}
        >
          {data?.title || 'AI in Healthcare'}
          <div className="h-1 w-32 bg-[#2E4168] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 absolute left-1/2 -translate-x-1/2 "></div>
        </h1>
        <p className="text-gray-700 max-w-5xl mx-auto mt-8 text-lg mb-10 md:mx-4 xl:mx-auto">
          {data?.description}
        </p>
      </div>

      {data.sections && data.sections.map((section, index) => (
        <section key={section._id || index} className="mb-10">
          <div className="container mx-auto px-2 lg:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.cards && section.cards.map((card, cardIndex) => (
                section.cardType === "highlight" ? (
                  <HighlightCard
                    key={card._id || cardIndex}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                  />
                ) : (
                  <MotionCard
                    key={card._id || cardIndex}
                    icon={card.icon}
                    color={card.color}
                    title={card.title}
                    description={card.description}
                  />
                )
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default AiPage;