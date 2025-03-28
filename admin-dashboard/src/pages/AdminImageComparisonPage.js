import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";
import config from "../config/config"; // Import the configuration file

const socket = io(config.socketBaseUrl, {
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  transports: ["websocket"], // Simplify to WebSocket only
  withCredentials: true,
  forceNew: true,
});

const AdminImageComparisonPage = () => {
  const defaultData = {
    heading: "Sample Prescription",
    description: "Move the slider left and right to see the magic!",
    sections: [
      {
        title: "In English",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-english.png",
      },
      {
        title: "हिन्दी में",
        beforeImage: "http://localhost:5000/images/compare-image.png",
        afterImage: "http://localhost:5000/images/compare-image-hindi.png",
      },
    ],
  };
  const [imageComparison, setImageComparison] = useState(defaultData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");

  const fetchImageComparison = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/image-comparison`);
      console.log("Fetched initial data:", response.data);
      setImageComparison({
        heading: response.data.heading || defaultData.heading,
        description: response.data.description || defaultData.description,
        sections: response.data.sections || defaultData.sections,
      });
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch image comparison data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageComparison();

    socket.on("connect", () => console.log("Socket.IO connected (admin):", socket.id));

    socket.on("imageComparison_created", (newData) => {
      console.log("Received imageComparison_created:", newData);
      setImageComparison(newData);
      toast.success("Image comparison created in real-time!");
    });

    socket.on("imageComparison_updated", (updatedData) => {
      console.log("Received imageComparison_updated:", updatedData);
      setImageComparison({ ...updatedData, sections: [...updatedData.sections] });
      console.log("State set to:", updatedData);
      toast.success("Image comparison updated in real-time!");
    });

    socket.on("connect_error", (err) => console.error("Socket.IO connection error:", err.message));

    socket.on("any", (event, ...args) => console.log("Received event:", event, args));

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("connect");
      socket.off("imageComparison_created");
      socket.off("imageComparison_updated");
      socket.off("connect_error");
      socket.off("any");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Current imageComparison state:", imageComparison);
  }, [imageComparison]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      toast.error("Please log in first.");
      return;
    }
    setIsSaving(true);
    try {
      console.log("Sending update with data:", imageComparison);
      const response = await axios.put(`${config.apiBaseUrl}/api/image-comparison`, imageComparison, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update response:", response.data);
      toast.success("Changes saved successfully!");
      setError("");
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError(err.response?.data?.message || "Error updating image comparison data");
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const addSection = () => {
    setImageComparison((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", beforeImage: "", afterImage: "" }],
    }));
    toast.success("New section added!");
  };

  const handleSectionChange = (index, field, value) => {
    setImageComparison((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleDeleteSection = (index) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    setImageComparison((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    toast.success("Section deleted!");
  };

  const handleFieldChange = (field, value) => {
    setImageComparison((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Image Comparison</h1>
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Header</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Heading</label>
                <input
                  type="text"
                  value={imageComparison.heading}
                  onChange={(e) => handleFieldChange("heading", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sample Prescription"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  value={imageComparison.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Move the slider left and right to see the magic!"
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Image Sections</h2>
            {imageComparison.sections.map((section, index) => (
              <div key={section._id || index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title (e.g., In English)"
                  required
                />
                <input
                  type="text"
                  value={section.beforeImage}
                  onChange={(e) => handleSectionChange(index, "beforeImage", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Before Image URL"
                  required
                />
                <input
                  type="text"
                  value={section.afterImage}
                  onChange={(e) => handleSectionChange(index, "afterImage", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="After Image URL"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSection(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSection}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Section
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

export default AdminImageComparisonPage;