import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config";

const AboutusLastSection = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });
  const [aboutUsLastSection, setAboutUsLastSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data
  const fetchAboutUsLastSection = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/thirdsection`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        console.log("Fetched data:", response.data.data); // Debug log
        setAboutUsLastSection(response.data.data);
        setFormData({
          heading: response.data.data.heading || "",
          description: response.data.data.description || "",
        });
      } else {
        setAboutUsLastSection(null);
        setFormData({ heading: "", description: "" });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("No Third Section data found (404)"); // Debug log
        setAboutUsLastSection(null);
        setFormData({ heading: "", description: "" });
      } else {
        toast.error("Failed to fetch About Us data");
        console.error("Fetch error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Create/Update data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const configHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };
      
      console.log("Submitting:", { aboutUsLastSection, formData }); // Debug log
      
      if (aboutUsLastSection?._id) {
        // Update existing record
        const response = await axios.put(
          `${config.apiBaseUrl}/api/thirdsection/${aboutUsLastSection._id}`,
          formData,
          configHeaders
        );
        if (response.data.success) {
          toast.success("Content updated successfully");
          setIsEditing(false);
        }
      } else {
        // Create new record
        const response = await axios.post(
          `${config.apiBaseUrl}/api/thirdsection`,
          formData,
          configHeaders
        );
        if (response.data.success) {
          toast.success("Content created successfully");
        }
      }
      await fetchAboutUsLastSection(); // Refresh data
    } catch (error) {
      if (error.response?.status === 404 && aboutUsLastSection?._id) {
        toast.error("Document not found. Please create a new one.");
        setAboutUsLastSection(null); // Reset to allow creation
      } else {
        toast.error(`Failed to ${aboutUsLastSection?._id ? "update" : "create"} content: ${error.message}`);
      }
      console.error("Submit error:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete data
  const handleDelete = async () => {
    if (!aboutUsLastSection?._id) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${config.apiBaseUrl}/api/thirdsection/${aboutUsLastSection._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.success) {
        toast.success("Content deleted successfully");
        setAboutUsLastSection(null);
        setFormData({ heading: "", description: "" });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to delete content: " + error.message);
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Socket setup and initial fetch
  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    fetchAboutUsLastSection();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("third_section_created", (data) => {
      console.log("Socket: Created:", data); // Debug log
      setAboutUsLastSection(data);
      setFormData({ heading: data.heading, description: data.description });
      toast.success("Content created in real-time!");
    });

    socket.on("third_section_updated", (data) => {
      console.log("Socket: Updated:", data); // Debug log
      setAboutUsLastSection(data);
      setFormData({ heading: data.heading, description: data.description });
      toast.success("Content updated in real-time!");
    });

    socket.on("third_section_deleted", () => {
      console.log("Socket: Deleted"); // Debug log
      setAboutUsLastSection(null);
      setFormData({ heading: "", description: "" });
      toast.success("Content deleted in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchAboutUsLastSection]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing || !aboutUsLastSection ? "Manage About Us Section" : "About Us Section"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700">
                Heading
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter heading"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter description"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {aboutUsLastSection ? "Update" : "Create"}
              </button>

              {aboutUsLastSection && (
                <>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Display current data */}
          {aboutUsLastSection && !isEditing && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Current Content:</h3>
              <p className="mt-2 text-gray-600">
                <strong>Heading:</strong> {aboutUsLastSection.heading}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Description:</strong> {aboutUsLastSection.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutusLastSection;