import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../socket";
import api from "../utils/api";

const WhyGudmedUnique = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/why-gudmed");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching WhyGudMed data:", error);
      }
    };

    fetchData();

    socket.on("whyGudMedUpdate", (updatedData) => {
      setData(updatedData);
    });

    socket.on("connect", () => {
      console.log("WhyGudMed: Connected to Socket.IO server");
    });

    socket.on("whyGudMedUpdated", (updatedData) => {
      console.log("WhyGudMed: Received update event:", updatedData);
      if (updatedData.deleted) {
        console.log("WhyGudMed: Page was deleted, refetching data...");
        fetchData();
        return;
      }

      if (updatedData && updatedData.cards) {
        const processedData = {
          ...updatedData,
          cards: updatedData.cards.map((card) => {
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
          }),
        };
        setData(processedData);
        toast.success("Content updated in real-time!");
      } else {
        console.error("WhyGudMed: Invalid update data received:", updatedData);
        fetchData();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("WhyGudMed: Socket.IO connection error:", err);
      setError("Failed to connect to server");
    });

    socket.on("disconnect", (reason) => {
      console.log("WhyGudMed: Socket.IO disconnected:", reason);
    });

    return () => {
      socket.off("whyGudMedUpdate");
      socket.off("whyGudMedUpdated");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
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
  if (!data || !data.cards) {
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
          {data.title}
        </motion.h2>
        <motion.p
          className="block text-xl md:max-w-3xl font-medium text-gray-800 text-center mb-12 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {data.description}
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.cards.map((card, index) => (
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