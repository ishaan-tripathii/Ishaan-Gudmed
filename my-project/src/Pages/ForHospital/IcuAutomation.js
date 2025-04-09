import React, { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaHeartbeat, FaChartLine, FaTools, FaIndustry } from "react-icons/fa";
import config from "../../config/config";

const socket = io(config.socketBaseUrl, { withCredentials: true });

const iconMap = {
  FaHeartbeat: FaHeartbeat,
  FaChartLine: FaChartLine,
  FaTools: FaTools,
  FaIndustry: FaIndustry,
};

const GudmedICUAutomation = () => {
  const [icuData, setIcuData] = useState({ title: "", description: "", features: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIcuAutomationData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/icu-automation`);
      console.log("API Response:", response.data); // Debug log
      setIcuData(response.data || { title: "", description: "", features: [] });
    } catch (error) {
      console.error("Error fetching ICU automation data:", error.response || error);
      setError("Failed to load ICU automation data.");
      setIcuData({ title: "", description: "", features: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIcuAutomationData();

    // Real-time updates with Socket.IO
    socket.on("connect", () => console.log("GudmedICUAutomation connected to socket:", socket.id));
    socket.on("icuAutomation_create", (data) => {
      console.log("Socket create received:", data);
      setIcuData((prev) => ({ ...prev, features: [...prev.features, data] }));
    });

    socket.on("icuAutomation_update", (data) => {
      console.log("Socket update received:", data);
      // Use the full updated document from the backend
      setIcuData(data);
    });

    socket.on("icuAutomation_delete", (data) => {
      console.log("Socket delete received:", data);
      setIcuData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f._id !== data.id),
      }));
    });

    socket.on("disconnect", () => console.log("GudmedICUAutomation disconnected from socket"));
    socket.on("connect_error", (error) => console.error("Socket connect error:", error.message));
    socket.on("error", (error) => console.error("Socket error:", error.message));

    return () => {
      socket.off("connect");
      socket.off("icuAutomation_create");
      socket.off("icuAutomation_update");
      socket.off("icuAutomation_delete");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
    };
  }, [fetchIcuAutomationData]); // No state dependencies to avoid re-render loops

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-6">
        {loading ? (
          <p className="text-gray-700 text-center pb-10">Loading ICU features...</p>
        ) : error ? (
          <p className="text-red-500 text-center pb-10">{error}</p>
        ) : icuData ? (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-4xl font-semibold text-[#2E4168] mb-6 text-center">
              {icuData.title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-10 text-center px-4 sm:px-20">
              {icuData.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-10">
              {icuData.features.length > 0 ? (
                icuData.features.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || FaHeartbeat; // Default to FaHeartbeat if icon not found
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4"
                      style={{ borderRadius: "20px" }}
                    >
                      <div className="w-full mb-4">
                        <img
                          src={feature.imageSrc}
                          alt={feature.title}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/192")}
                        />
                      </div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className="p-3 rounded-full shadow-md flex items-center justify-center"
                          style={{ backgroundColor: feature.iconBgColor || "#DBEAFE" }}
                        >
                          {IconComponent && (
                            <IconComponent size={24} style={{ color: feature.iconColor || "#2563EB" }} />
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-[#2E4168]">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-700 text-center">No ICU features available.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-center pb-10">No ICU data available.</p>
        )}
      </div>
    </div>
  );
};

export default GudmedICUAutomation;