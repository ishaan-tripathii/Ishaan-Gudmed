import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WHY_GUDMED_PORT = "5000"; // Adjust to your backend port
const socket = io(`http://localhost:${WHY_GUDMED_PORT}`);

const WhyGudmedUnique = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:${WHY_GUDMED_PORT}/api/why-gudmed`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data = result.success && result.data.length > 0 ? result.data[0] : null;
      if (data && data.cards) {
        data.cards = data.cards.map((card) => {
          if (card.title === "Comprehensive Hospital Support" && !card.points) {
            const points = [
              { icon: "FaClock", text: "Quick Discharge Summaries: Reducing patient waiting times." },
              { icon: "FaBrain", text: "AI-Driven Solutions: Enhancing operational excellence." },
              { icon: "FaFileMedical", text: "MRD File Management: Capturing patient records across OPD and IPD." },
              { icon: "FaCalendarCheck", text: "Post-Care Management: Timely medication reminders and follow-up scheduling." },
            ];
            return {
              ...card,
              description: "We empower hospitals with features designed to streamline operations:",
              points,
            };
          }
          return card;
        });
      }
      setPageData(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error (WhyGudmedUnique):", err);
      setError(`Failed to fetch data from port ${WHY_GUDMED_PORT}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO on port", WHY_GUDMED_PORT);
    });

    socket.on("contentUpdated", (update) => {
      if (update.type === "why-gudmed" && update.data?.length > 0) {
        const data = update.data[0];
        if (data.cards) {
          data.cards = data.cards.map((card) => {
            if (card.title === "Comprehensive Hospital Support" && !card.points) {
              const points = [
                { icon: "FaClock", text: "Quick Discharge Summaries: Reducing patient waiting times." },
                { icon: "FaBrain", text: "AI-Driven Solutions: Enhancing operational excellence." },
                { icon: "FaFileMedical", text: "MRD File Management: Capturing patient records across OPD and IPD." },
                { icon: "FaCalendarCheck", text: "Post-Care Management: Timely medication reminders and follow-up scheduling." },
              ];
              return {
                ...card,
                description: "We empower hospitals with features designed to streamline operations:",
                points,
              };
            }
            return card;
          });
        }
        setPageData(data);
        toast.success("Why Gudmed Unique updated!");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setError(`Socket.IO failed to connect to port ${WHY_GUDMED_PORT}`);
    });

    return () => {
      socket.off("contentUpdated");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  const renderIcon = (iconString, size = "text-4xl") => {
    if (!iconString || typeof iconString !== "string") {
      return <FaIcons.FaHeart className={`text-blue-600 ${size} mb-3`} />;
    }
    const IconComponent = FaIcons[iconString] || FaIcons.FaHeart;
    return <IconComponent className={`text-blue-600 ${size} mb-3`} />;
  };

  if (loading) return <div className="text-center py-10">Loading WhyGudmedUnique...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!pageData || !pageData.cards) {
    return <div className="text-center py-10">No WhyGudmedUnique data available</div>;
  }

  return (
    <section className="bg-white py-10 px-6 lg:px-20">
      <ToastContainer />
      <div className="container mx-auto">
        <motion.h2
          className="text-[1.8rem] lg:text-4xl font-bold text-[#2E4168] text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {pageData.title}
        </motion.h2>
        <motion.p
          className="block text-xl md:max-w-3xl font-medium text-gray-800 text-center mb-12 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {pageData.description}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {pageData.cards.map((card, index) => (
            <motion.div
              key={card._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                {renderIcon(card.icon, "text-4xl")}
                <h3 className="text-2xl font-semibold text-[#2E4168] mb-4">{card.title}</h3>
              </div>
              <p className="text-[#2E4168] mb-4">{card.description}</p>
              {card.points && (
                <ul className="space-y-3">
                  {card.points.map((point, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      {renderIcon(point.icon, "text-lg")}
                      <span className="text-gray-600">{point.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-4 bg-white py-12 px-6 rounded-xl shadow-lg text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#2E4168] mb-4 leading-tight">
              Join the GudMed Revolution
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              Partner with GudMed and embrace a smarter, more efficient future for healthcare. Contact us today to learn how we can transform your healthcare operations.
            </p>
            <div className="mt-6">
              <a
                href="/contacts"
                className="bg-[#2E4168] text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:bg-[#1A3051] hover:shadow-lg transition-all duration-300"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGudmedUnique;