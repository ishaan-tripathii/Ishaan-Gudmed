import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client";
import config from "../config/config"; // Added import for config

const WhyGudmedUnique = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/why-gudmed`); // Adjusted endpoint
        setData(response.data.data[0] || null);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Why Gudmed Unique content");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("connect", () => {
    });

    socket.on("whyGudMed_created", (newData) => {
      setData(newData); // Assume single-page design
      toast.success("Why Gudmed Unique created!");
    });

    socket.on("whyGudMed_updated", (updatedData) => {
      setData(updatedData);
      toast.success("Why Gudmed Unique updated!");
    });

    socket.on("whyGudMed_deleted", (deletedData) => {
      if (data && data._id === deletedData._id) {
        setData(null);
        toast.info("Why Gudmed Unique page deleted!");
      }
    });

    socket.on("connect_error", (err) => {
    });

    return () => {
      socket.off("connect");
      socket.off("whyGudMed_created");
      socket.off("whyGudMed_updated");
      socket.off("whyGudMed_deleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const renderIcon = (iconString, size = "text-4xl") => {
    if (!iconString || typeof iconString !== "string") {
      return <FaIcons.FaHeart className={`text-blue-600 ${size} mb-3`} />;
    }
    const IconComponent = FaIcons[iconString] || FaIcons.FaHeart;
    return <IconComponent className={`text-blue-600 ${size} mb-3`} />;
  };

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
        <p className="text-red-500 text-lg">Error loading Why Gudmed Unique content: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12 bg-white">
        <p className="text-gray-500 text-lg">Why Gudmed Unique content is not available.</p>
      </div>
    );
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
          {data.cards &&
            data.cards.map((card, index) => (
              <motion.div
                key={card._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
              {data.footer?.title || "Join the GudMed Revolution"}
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              {data.footer?.description ||
                "Partner with GudMed and embrace a smarter, more efficient future for healthcare. Contact us today to learn how we can transform your healthcare operations."}
            </p>
            <div className="mt-6">
              <a
                href={data.footer?.ctaLink || "/contacts"}
                className="bg-[#2E4168] text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:bg-[#1A3051] hover:shadow-lg transition-all duration-300"
              >
                {data.footer?.ctaText || "Contact Us Today"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGudmedUnique;