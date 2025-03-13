import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa"; // FontAwesome
import * as MdIcons from "react-icons/md"; // Material Design
import * as BsIcons from "react-icons/bs"; // Bootstrap Icons
// Add more libraries as needed (e.g., import * as IoIcons from "react-icons/io5")
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

// Map of available icon libraries
const iconLibraries = {
  fa: FaIcons,
  md: MdIcons,
  bs: BsIcons,
  // Add more: 'io5': IoIcons, etc.
};

const WhyGudmedUnique = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ai-pages");
      const data = await response.json();
      if (data.length > 0) {
        setPageData(data[0]); // Use the first page's data
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    // Listen for real-time updates
    socket.on("contentUpdated", () => {
      fetchData(); // Refetch data when event is received
    });

    // Cleanup on unmount
    return () => {
      socket.off("contentUpdated");
    };
  }, []);

  // Dynamic icon renderer
  const renderIcon = (iconString) => {
    if (!iconString || typeof iconString !== "string") {
      return <FaIcons.FaDigitalTachograph className="text-blue-600 text-4xl mb-3" />; // Fallback
    }

    // Split icon string into library and icon name (e.g., "fa/FaStar" -> ["fa", "FaStar"])
    const [library, iconName] = iconString.split("/");

    if (!library || !iconName || !iconLibraries[library]) {
      return <FaIcons.FaDigitalTachograph className="text-blue-600 text-4xl mb-3" />; // Fallback if invalid
    }

    const IconComponent = iconLibraries[library][iconName];
    return IconComponent ? (
      <IconComponent className="text-blue-600 text-4xl mb-3" />
    ) : (
      <FaIcons.FaDigitalTachograph className="text-blue-600 text-4xl mb-3" /> // Fallback if icon not found
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!pageData) return <div className="text-center py-10">No data available</div>;

  return (
    <section className="bg-white py-10 px-6 lg:px-20">
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
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                {renderIcon(card.icon)} {/* Dynamic icon rendering */}
                <h3 className="text-2xl font-semibold text-[#2E4168] mb-4">{card.title}</h3>
              </div>
              <p className="text-[#2E4168] mb-4">{card.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 bg-white py-12 px-6 rounded-xl shadow-lg text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#2E4168] mb-4 leading-tight">
              {pageData.footer?.title || "Join the GudMed Revolution"}
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              {pageData.footer?.description ||
                "Partner with GudMed and embrace a smarter, more efficient future for healthcare. Contact us today to learn how we can transform your healthcare operations."}
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