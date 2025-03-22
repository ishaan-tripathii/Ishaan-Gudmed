import React, { useState, useEffect } from "react";
import { FaHospital, FaRobot, FaChartBar, FaRegPaperPlane, FaHeartbeat, FaMedkit, FaClipboardCheck } from "react-icons/fa";
import { FiSettings, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { socket } from "../socket";
import api from "../utils/api";

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

const TechnologyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/pages");
        // Filter for technology page
        const technologyPage = response.data.data.find(page => page.slug === "gudmed's technology");
        setData(technologyPage ? [technologyPage] : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching technology data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("pageUpdate", (updatedData) => {
      const technologyPage = updatedData.find(page => page.slug === "gudmed's technology");
      setData(technologyPage ? [technologyPage] : []);
    });

    return () => {
      socket.off("pageUpdate");
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

  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500 text-lg">No technology page data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="text-center mb-6 -mt-12 md:-mt-6">
        <h1 className="text-4xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-4 p-6">
          {data[0].title}
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg mt-0 md:-mt-4">
          {data[0].description}
        </p>
      </div>

      {data[0].sections && data[0].sections.map((section, index) => (
        <section key={index} className="mb-10">
          <div className="container mx-auto px-2 lg:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {section.cards.map((card, cardIndex) => (
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
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TechnologyPage;