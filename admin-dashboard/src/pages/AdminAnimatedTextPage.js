// src/components/AdminAnimatedTextPage.jsx
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";
import axios from "axios";
import config from "../config/config"; // Adjust the path to the actual location of the config file

// API and Socket.IO configuration
const API_BASE_URL = config.apiBaseUrl;
const socket = io(config.socketBaseUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const AdminAnimatedTextPage = () => {
  const defaultData = {
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
  };

  const [animatedText, setAnimatedText] = useState(defaultData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");

  const fetchAnimatedText = async () => {
    try {
      const response = await api.get("/animated-text", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimatedText({
        redMarquee: response.data.redMarquee || defaultData.redMarquee,
        blackMarquee: response.data.blackMarquee || defaultData.blackMarquee,
      });
    } catch (err) {
      setError("Failed to fetch animated text");
      setAnimatedText(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAnimatedText();

    // Socket.IO setup
    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });

    socket.on("animatedText_updated", (updatedData) => {
      setAnimatedText({
        redMarquee: updatedData.redMarquee,
        blackMarquee: updatedData.blackMarquee,
      });
      toast.success("Animated text updated in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("animatedText_updated");
      socket.off("connect_error");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      toast.error("Please log in first.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await api.put(
        "/animated-text",
        animatedText,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnimatedText(response.data);
      toast.success("Changes saved successfully!");
      setError("");
      // Socket.IO will handle the real-time update
    } catch (err) {
      setError(err.response?.data?.message || "Error updating animated text data");
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const addItem = (marqueeType) => {
    setAnimatedText((prev) => ({
      ...prev,
      [marqueeType]: [...prev[marqueeType], { text: "", icon: "" }],
    }));
    toast.success(`New item added to ${marqueeType === "redMarquee" ? "Red" : "Black"} Marquee!`);
  };

  const handleItemChange = (marqueeType, index, field, value) => {
    setAnimatedText((prev) => ({
      ...prev,
      [marqueeType]: prev[marqueeType].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleDeleteItem = (marqueeType, index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setAnimatedText((prev) => ({
      ...prev,
      [marqueeType]: prev[marqueeType].filter((_, i) => i !== index),
    }));
    toast.success("Item deleted!");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Animated Text</h1>
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Red Marquee (Right-to-Left)</h2>
            {animatedText.redMarquee.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleItemChange("redMarquee", index, "text", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Text (e.g., Faster Discharges = Higher Bed Turnover ⏩)"
                />
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => handleItemChange("redMarquee", index, "icon", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Icon (e.g., FaRobot)"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteItem("redMarquee", index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem("redMarquee")}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Item
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Black Marquee (Left-to-Right)</h2>
            {animatedText.blackMarquee.map((item, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleItemChange("blackMarquee", index, "text", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Text (e.g., Direct Pharmacy Integration for more revenues 💰)"
                />
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => handleItemChange("blackMarquee", index, "icon", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Icon (e.g., FaCapsules)"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteItem("blackMarquee", index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem("blackMarquee")}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Item
            </button>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto p-3 bg-green-600 text-white rounded-lg text-lg font-semibold transition-all duration-300 ${isSaving ? "animate-pulse opacity-75 cursor-not-allowed" : "hover:bg-green-700"
                }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAnimatedTextPage;