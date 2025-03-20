import React, { useState, useEffect } from "react";
import { FaHospital, FaRobot, FaChartBar, FaRegPaperPlane, FaHeartbeat, FaMedkit, FaClipboardCheck } from "react-icons/fa";
import { FiSettings, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { socket } from "../socket";

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
  const [aiPageData, setAiPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAiPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/ai-pages");
      const fetchedData = Array.isArray(response.data)
        ? response.data[0]
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data[0]
        : null;
      setAiPageData(fetchedData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching AI page data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiPageData();
    socket.on("aiPageUpdated", (updatedPage) => {
      console.log("AiPage received aiPageUpdated:", updatedPage);
      if (updatedPage.deleted) {
        setAiPageData(null);
      } else {
        setAiPageData((prevData) => {
          if (prevData && prevData._id === updatedPage._id) {
            return updatedPage;
          }
          return prevData;
        });
      }
    });

    return () => {
      socket.off("aiPageUpdated");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!aiPageData) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500 text-lg">No AI page data found.</p>
      </div>
    );
  }

  const getGridClasses = (cardCount) => {
    const maxCols = 4;
    const cols = Math.min(cardCount, maxCols);
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols > 2 ? cols : 2} lg:grid-cols-${cols} gap-8`;
  };

  return (
    <div className="bg-white py-12 px-6">
      <div className="text-center mb-6 -mt-12 md:-mt-6">
        <h1
          className="text-4xl font-bold text-[#2E4168] relative inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text leading-normal"
          style={{ color: aiPageData.titleColor || '#000000' }}
        >
          {aiPageData.title}
          <div className="h-1 w-32 bg-[#2E4168] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 absolute left-1/2 -translate-x-1/2 "></div>
          
        </h1>
        <p className="text-gray-700 max-w-5xl mx-auto mt-8 text-lg mb-10 md:mx-4 xl:mx-auto">
          {aiPageData.description}
        </p>
      </div>

      {Array.isArray(aiPageData.sections) && aiPageData.sections.length > 0 ? (
        aiPageData.sections.map((section, index) => (
          <section key={index} className="mb-10">
            <div className="container mx-auto px-2 lg:px-0">
              <div className={getGridClasses(section.cards?.length || 0)}>
                {Array.isArray(section.cards) && section.cards.length > 0 ? (
                  section.cards.map((card, cardIndex) => (
                    section.cardType === "highlight" ? (
                      <HighlightCard
                        key={cardIndex}
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                      />
                    ) : (
                      <MotionCard
                        key={cardIndex}
                        icon={card.icon}
                        color={card.color}
                        title={card.title}
                        description={card.description}
                      />
                    )
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center">No cards available in this section.</p>
                )}
              </div>
            </div>
          </section>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No sections available.</p>
        </div>
      )}
    </div>
  );
};

export default AiPage;