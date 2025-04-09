import React, { useState, useEffect, useCallback } from "react";
import apiService from "../../services/api/apiService";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const socket = io(config.socketBaseUrl, { withCredentials: true });

const AdminICUAutomationPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User in AdminICUAutomationPage:", user);
    console.log("Token in AdminICUAutomationPage:", token);
    if (!user) {
      console.log("Redirecting to login: User is null");
      navigate("/login");
    }
  }, [user, navigate, token]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageSrc: "",
    icon: "",
    iconColor: "",
    iconBgColor: "",
  });
  const [sectionFormData, setSectionFormData] = useState({
    title: "Revolutionizing ICU Automation with Gudmed",
    description: "Gudmed is transforming Intensive Care Unit (ICU) management with cutting-edge AI solutions designed to improve patient outcomes, streamline workflows, and empower healthcare professionals.",
  });
  const [icuData, setIcuData] = useState({ title: "", description: "", features: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [editFeatureId, setEditFeatureId] = useState(null);

  const fetchIcuAutomationData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`${config.apiBaseUrl}/api/icu-automation`);
      setIcuData(response.data || { title: "", description: "", features: [] });
    } catch (error) {
      console.log("API Error:", error.response || error);
      toast.error("Failed to fetch ICU automation data: " + (error.response?.data?.message || error.message));
      setIcuData({ title: "", description: "", features: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIcuAutomationData();

    socket.on("connect", () => console.log("AdminICUAutomation connected to socket:", socket.id));
    socket.on("icuAutomation_create", (data) => {
      console.log("Socket create received:", data);
      setIcuData((prev) => ({ ...prev, features: [...prev.features, data] }));
      toast.success("Card created in real-time!");
    });

    socket.on("icuAutomation_update", (data) => {
      console.log("Socket update received:", data);
      setIcuData(data); // Use full document update
      toast.success("Card updated in real-time!");
    });

    socket.on("icuAutomation_delete", (data) => {
      console.log("Socket delete received:", data);
      setIcuData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f._id !== data.id),
      }));
      toast.success("Card deleted in real-time!");
    });

    socket.on("disconnect", () => console.log("AdminICUAutomation disconnected from socket"));
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
  }, [fetchIcuAutomationData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (e) => {
    setSectionFormData({ ...sectionFormData, [e.target.name]: e.target.value });
  };

  const handleCreateFeature = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiService.post(`${config.apiBaseUrl}/api/icu-automation`, formData);
      toast.success("Successfully created new card");
      setFormData({
        title: "",
        description: "",
        imageSrc: "",
        icon: "",
        iconColor: "",
        iconBgColor: "",
      });
      fetchIcuAutomationData();
    } catch (error) {
      toast.error("Error creating card: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFeature = async (e) => {
    e.preventDefault();
    if (!editFeatureId) return;
    setIsLoading(true);
    try {
      console.log("Sending update with featureId:", editFeatureId, "data:", formData); // Debug log
      await apiService.put(
        `${config.apiBaseUrl}/api/icu-automation/feature/${editFeatureId}`,
        formData
      );
      toast.success(`Successfully updated card with ID: ${editFeatureId}`);
      setFormData({
        title: "",
        description: "",
        imageSrc: "",
        icon: "",
        iconColor: "",
        iconBgColor: "",
      });
      setEditFeatureId(null);
      fetchIcuAutomationData();
    } catch (error) {
      console.log("Update Error:", error.response || error);
      toast.error("Error updating card: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (featureId) => {
    if (!window.confirm(`Are you sure you want to delete the card with ID: ${featureId}?`)) return;
    setIsLoading(true);
    try {
      await apiService.delete(`${config.apiBaseUrl}/api/icu-automation/feature/${featureId}`);
      toast.success(`Successfully deleted card with ID: ${featureId}`);
      fetchIcuAutomationData();
    } catch (error) {
      toast.error("Error deleting card: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (feature) => {
    setEditFeatureId(feature._id);
    setFormData({
      title: feature.title,
      description: feature.description,
      imageSrc: feature.imageSrc,
      icon: feature.icon,
      iconColor: feature.iconColor,
      iconBgColor: feature.iconBgColor,
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiService.put(`${config.apiBaseUrl}/api/icu-automation`, sectionFormData);
      setIcuData((prev) => ({ ...prev, ...response.data }));
      toast.success("Section updated successfully");
      fetchIcuAutomationData();
    } catch (error) {
      console.log("Section Submit Error:", error.response || error);
      toast.error("Error updating section: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#2E4168]">Manage ICU Automation Cards</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Section Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-[#2E4168] mb-4">Edit Section</h2>
        <form onSubmit={handleSectionSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Section Title:</label>
            <input
              type="text"
              name="title"
              value={sectionFormData.title}
              onChange={handleSectionChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Section Description:</label>
            <textarea
              name="description"
              value={sectionFormData.description}
              onChange={handleSectionChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Processing..." : "Update Section"}
          </button>
        </form>
      </div>

      {/* Card Form */}
      <form
        onSubmit={editFeatureId ? handleUpdateFeature : handleCreateFeature}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold text-[#2E4168] mb-4">
          {editFeatureId ? "Edit Specific Card" : "Add New Card"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Image URL:</label>
            <input
              type="text"
              name="imageSrc"
              value={formData.imageSrc}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Icon:</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., FaHeartbeat, FaChartLine"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Icon Color:</label>
            <input
              type="text"
              name="iconColor"
              value={formData.iconColor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., #2563EB, red"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Icon Background Color:</label>
            <input
              type="text"
              name="iconBgColor"
              value={formData.iconBgColor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., #DBEAFE, lightblue"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Processing..." : editFeatureId ? "Update Card" : "Add Card"}
          </button>
          {editFeatureId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  imageSrc: "",
                  icon: "",
                  iconColor: "",
                  iconBgColor: "",
                });
                setEditFeatureId(null);
              }}
              disabled={isLoading}
              className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Card List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#2E4168] mb-4">Manage Cards</h2>
        {isLoading ? (
          <p className="text-gray-700">Loading...</p>
        ) : icuData.features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {icuData.features.map((feature) => (
              <div
                key={feature._id}
                className="border border-blue-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow overflow-hidden"
              >
                <img
                  src={feature.imageSrc}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: feature.iconBgColor, color: feature.iconColor }}
                  >
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(feature)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(feature._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No cards available. Add a new card to get started!</p>
        )}
      </div>
    </div>
  );
};

export default AdminICUAutomationPage;