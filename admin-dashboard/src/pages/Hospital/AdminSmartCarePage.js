import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config";

const AboutusLastSection = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description1: "",
    description2: "",
  });

  const [aboutUsLastSection, setAboutUsLastSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const configHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // GET - Fetch content
  const fetchAboutUsLastSection = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/smartCare`, configHeaders);
      if (response.data.success) {
        const data = response.data.data;
        setAboutUsLastSection(data);
        setFormData({
          title: data.title || "",
          description1: data.description1 || "",
          description2: data.description2 || "",
        });
      } else {
        setAboutUsLastSection(null);
        setFormData({ title: "", description1: "", description2: "" });
      }
    } catch (error) {
      toast.error("Error fetching About Us content.");
      setAboutUsLastSection(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // POST - Create new
  const createAboutUs = async () => {
    const response = await axios.post(`${config.apiBaseUrl}/api/smartCare`, formData, configHeaders);
    return response.data;
  };

  // PUT - Update
  const updateAboutUs = async (id) => {
    const response = await axios.put(`${config.apiBaseUrl}/api/smartCare/${id}`, formData, configHeaders);
    return response.data;
  };

  // DELETE - Delete
  const deleteAboutUs = async (id) => {
    const response = await axios.delete(`${config.apiBaseUrl}/api/smartCare/${id}`, configHeaders);
    return response.data;
  };

  // Submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      if (aboutUsLastSection?._id) {
        result = await updateAboutUs(aboutUsLastSection._id);
        if (result.success) {
          toast.success("Content updated successfully");
          setIsEditing(false);
        }
      } else {
        result = await createAboutUs();
        if (result.success) {
          toast.success("Content created successfully");
        }
      }
      await fetchAboutUsLastSection();
    } catch (error) {
      toast.error(`Failed to ${aboutUsLastSection?._id ? "update" : "create"} content`);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!aboutUsLastSection?._id) return;
    setIsLoading(true);
    try {
      const result = await deleteAboutUs(aboutUsLastSection._id);
      if (result.success) {
        toast.success("Content deleted successfully");
        setAboutUsLastSection(null);
        setFormData({ title: "", description1: "", description2: "" });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to delete content");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    fetchAboutUsLastSection();

    socket.on("connect", () => console.log("Socket connected"));

    socket.on("smartcare_created", (data) => {
      setAboutUsLastSection(data);
      setFormData(data);
      toast.success("SmartCare section created in real-time!");
    });

    socket.on("smartcare_updated", (data) => {
      setAboutUsLastSection(data);
      setFormData(data);
      toast.success("SmartCare section updated in real-time!");
    });

    socket.on("smartcare_deleted", () => {
      setAboutUsLastSection(null);
      setFormData({ title: "", description1: "", description2: "" });
      toast.success("SmartCare section deleted in real-time!");
    });

    socket.on("connect_error", (err) => console.error("Socket error:", err.message));

    return () => socket.disconnect();
  }, [fetchAboutUsLastSection]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing || !aboutUsLastSection ? "Manage About Us Section" : "About Us Section"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              className="w-full border rounded p-2"
              disabled={isLoading}
            />
            <textarea
              name="description1"
              value={formData.description1}
              onChange={handleInputChange}
              placeholder="Enter Description 1"
              rows="3"
              className="w-full border rounded p-2"
              disabled={isLoading}
            />
            <textarea
              name="description2"
              value={formData.description2}
              onChange={handleInputChange}
              placeholder="Enter Description 2"
              rows="3"
              className="w-full border rounded p-2"
              disabled={isLoading}
            />

            {/* ✅ Fixed Button Logic */}
            <div className="flex gap-4">
              {/* Show Create button if there's no existing section */}
              {!aboutUsLastSection && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create
                </button>
              )}

              {/* Show Update & Delete buttons when editing */}
              {aboutUsLastSection && isEditing && (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}

              {/* Show Edit & Delete buttons when not editing */}
              {aboutUsLastSection && !isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </form>

          {aboutUsLastSection && !isEditing && (
            <div className="mt-6">
              <p><strong>Title:</strong> {aboutUsLastSection.title}</p>
              <p><strong>Description 1:</strong> {aboutUsLastSection.description1}</p>
              <p><strong>Description 2:</strong> {aboutUsLastSection.description2}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutusLastSection;
