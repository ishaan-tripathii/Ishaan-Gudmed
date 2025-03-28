import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/config"; // Import the configuration file

const AdminComparisonPage = () => {
  const [comparison, setComparison] = useState({
    title: "GudMed vs Other Technologies",
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const iconOptions = [
    "DocumentDuplicateIcon",
    "DocumentTextIcon",
    "MagnifyingGlassCircleIcon",
    "ChartBarIcon",
    "LinkIcon",
    "ClipboardDocumentCheckIcon",
    "BellAlertIcon",
    "ShieldCheckIcon",
    "LockClosedIcon",
  ];

  useEffect(() => {
    const socket = io(config.socketBaseUrl, { // Use socketBaseUrl from config
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchComparison = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/comparison`, { // Use apiBaseUrl from config
          headers: { Authorization: `Bearer ${token}` },
        });
        setComparison({
          title: response.data.title || "GudMed vs Other Technologies",
          items: response.data.items || [],
        });
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch comparison data");
        setLoading(false);
      }
    };

    fetchComparison();

    socket.on("connect", () => {
      console.log("AdminComparisonPage Socket.IO connected:", socket.id);
    });

    socket.on("comparison_created", (data) => {
      console.log("Received comparison_created:", data);
      setComparison({
        title: data.title || "GudMed vs Other Technologies",
        items: data.items || [],
      });
      toast.success("Comparison created in real-time!");
    });

    socket.on("comparison_updated", (data) => {
      console.log("Received comparison_updated:", data);
      setComparison({
        title: data.title || "GudMed vs Other Technologies",
        items: data.items || [],
      });
      toast.success("Comparison updated in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("AdminComparisonPage Socket.IO connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("comparison_created");
      socket.off("comparison_updated");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to perform this action.");
      return;
    }
    try {
      await axios.put(
        `${config.apiBaseUrl}/api/comparison`, // Use apiBaseUrl from config
        comparison,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Comparison data updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating comparison data");
    }
  };

  const addItem = () => {
    setComparison((prev) => ({
      ...prev,
      items: [...prev.items, { aspect: "", other: { text: "", icon: "" }, gudmed: { text: "", icon: "" } }],
    }));
  };

  const handleItemChange = (index, field, subField, value) => {
    setComparison((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? subField
            ? { ...item, [field]: { ...item[field], [subField]: value } }
            : { ...item, [field]: value }
          : item
      ),
    }));
  };

  const handleDeleteItem = (index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setComparison((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    toast.success("Item deleted successfully! Save to confirm.");
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    setComparison((prev) => {
      const items = [...prev.items];
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      return { ...prev, items };
    });
  };

  const moveItemDown = (index) => {
    if (index === comparison.items.length - 1) return;
    setComparison((prev) => {
      const items = [...prev.items];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      return { ...prev, items };
    });
  };

  const handleTitleChange = (value) => {
    setComparison((prev) => ({ ...prev, title: value }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Comparison Section</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Section Title</h2>
            <input
              type="text"
              value={comparison.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., GudMed vs Other Technologies"
              required
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Comparison Items</h2>
            {comparison.items.map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
              >
                <input
                  type="text"
                  value={item.aspect}
                  onChange={(e) => handleItemChange(index, "aspect", null, e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Aspect (e.g., Prescription Handling)"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Other Technologies Text</label>
                    <input
                      type="text"
                      value={item.other.text}
                      onChange={(e) => handleItemChange(index, "other", "text", e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Other tech description"
                      required
                    />
                    <select
                      value={item.other.icon}
                      onChange={(e) => handleItemChange(index, "other", "icon", e.target.value)}
                      className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Icon</option>
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">GudMed Text</label>
                    <input
                      type="text"
                      value={item.gudmed.text}
                      onChange={(e) => handleItemChange(index, "gudmed", "text", e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="GudMed description"
                      required
                    />
                    <select
                      value={item.gudmed.icon}
                      onChange={(e) => handleItemChange(index, "gudmed", "icon", e.target.value)}
                      className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Icon</option>
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === comparison.items.length - 1}
                    className={`p-2 rounded-lg text-white ${index === comparison.items.length - 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Comparison Item
            </button>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      </div>
    </div>
  );
};

export default AdminComparisonPage;