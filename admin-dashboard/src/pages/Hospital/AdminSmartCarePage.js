import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import config from "../../config/config";

const AdminSmartCare = () => {
  const [smartCareSection, setSmartCareSection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description1: "",
    description2: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const socket = io(config.apiBaseUrl, { auth: { token } });
  const configHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch SmartCare section data
  const fetchSmartCareSection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiBaseUrl}/api/smartCare`, configHeaders);
      const data = response.data;
      setSmartCareSection(data);
      setFormData({
        title: data?.title || "",
        description1: data?.description1 || "",
        description2: data?.description2 || "",
      });
    } catch (error) {
      console.error("Error fetching SmartCare section:", error);
      toast.error("Failed to fetch SmartCare section");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // CRUD operations
  const createSmartCare = async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/smartCare`, formData, configHeaders);
    return response.data;
  };

  const updateSmartCare = async (id) => {
    const response = await axios.put(`${config.apiBaseUrl}/api/smartCare/${id}`, formData, configHeaders);
    return response.data;
  };

  const deleteSmartCare = async (id) => {
    const response = await axios.delete(`${config.apiBaseUrl}/api/smartCare/${id}`, configHeaders);
    return response.data;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (smartCareSection?._id) {
        const { success } = await updateSmartCare(smartCareSection._id);
        if (success) toast.success("SmartCare section updated successfully");
      } else {
        const { success } = await createSmartCare();
        if (success) toast.success("SmartCare section created successfully");
      }
      await fetchSmartCareSection();
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting SmartCare section:", error);
      toast.error("Failed to save SmartCare section");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!smartCareSection?._id) return;
    try {
      setLoading(true);
      const result = await deleteSmartCare(smartCareSection._id);
      if (result.success) {
        toast.success("SmartCare section deleted successfully");
        setSmartCareSection(null);
        setFormData({ title: "", description1: "", description2: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error deleting SmartCare section:", error);
      toast.error("Failed to delete SmartCare section");
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO real-time updates
  useEffect(() => {
    fetchSmartCareSection();

    socket.on("smartcare_created", (data) => {
      setSmartCareSection(data);
      setFormData({
        title: data.title,
        description1: data.description1,
        description2: data.description2,
      });
      toast.info("SmartCare section created in real-time");
    });

    socket.on("smartcare_updated", (data) => {
      setSmartCareSection(data);
      setFormData({
        title: data.title,
        description1: data.description1,
        description2: data.description2,
      });
      toast.info("SmartCare section updated in real-time");
    });

    socket.on("smartcare_deleted", () => {
      setSmartCareSection(null);
      setFormData({ title: "", description1: "", description2: "" });
      toast.info("SmartCare section deleted in real-time");
    });

    return () => {
      socket.off("smartcare_created");
      socket.off("smartcare_updated");
      socket.off("smartcare_deleted");
    };
  }, [fetchSmartCareSection]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing || !smartCareSection ? "Manage SmartCare Section" : "SmartCare Section"}
      </h2>

      {loading && <p>Loading...</p>}

      {smartCareSection && !isEditing && (
        <div className="mt-6">
          <p><strong>Title:</strong> {smartCareSection.title}</p>
          <p><strong>Description 1:</strong> {smartCareSection.description1}</p>
          <p><strong>Description 2:</strong> {smartCareSection.description2}</p>
          <div className="mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {(isEditing || !smartCareSection) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description 1</label>
            <textarea
              name="description1"
              value={formData.description1}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description 2</label>
            <textarea
              name="description2"
              value={formData.description2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {smartCareSection?._id ? "Update" : "Create"}
            </button>
            {smartCareSection && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSmartCare;