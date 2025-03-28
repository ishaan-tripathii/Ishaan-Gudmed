// src/components/PageForm.jsx
import React, { useState, useEffect } from "react";
import Modal from "../components/common/Modal";
import { toast } from "react-toastify";
import axios from "axios";
import io from "socket.io-client";
import config from "../config/config"; // Import the config file

// API and Socket.IO configuration
const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const PageForm = ({ pageToEdit, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    titleDesktop: "",
    titleMobile: "",
    gradientWords: [],
    gradient: "",
    benefits: [],
    slug: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gradient style options
  const gradientOptions = [
    { value: "bg-gradient-to-r from-blue-400 to-purple-500", label: "Blue to Purple" },
    { value: "bg-gradient-to-r from-purple-400 to-pink-500", label: "Purple to Pink" },
    { value: "bg-gradient-to-r from-pink-500 to-red-500", label: "Pink to Red" },
  ];

  // Initialize Socket.IO
  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      // Removed console.log
    });

    socket.on("pageCreated", (newPage) => {
      toast.success("New slide created in real-time!");
    });

    socket.on("pageUpdated", (updatedPage) => {
      toast.success("Slide updated in real-time!");
    });

    socket.on("pageDeleted", (slug) => {
      toast.success("Slide deleted in real-time!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error in PageForm:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Populate form with pageToEdit data when editing
  useEffect(() => {
    if (pageToEdit) {
      setFormData({
        titleDesktop: pageToEdit.titleDesktop || "",
        titleMobile: pageToEdit.titleMobile || "",
        gradientWords: Array.isArray(pageToEdit.gradientWords)
          ? pageToEdit.gradientWords
          : [],
        gradient: pageToEdit.gradient || "",
        benefits: Array.isArray(pageToEdit.benefits) ? pageToEdit.benefits : [],
        slug: pageToEdit.slug || "",
      });
    } else {
      setFormData({
        titleDesktop: "",
        titleMobile: "",
        gradientWords: [],
        gradient: "",
        benefits: [],
        slug: "",
      });
    }
  }, [pageToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (pageToEdit) {
        await api.put(`/pages/${pageToEdit._id}`, formData);
        toast.success("Slide updated successfully");
      } else {
        await api.post("/pages", formData);
        toast.success("Slide created successfully");
      }
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save slide";
      toast.error(errorMessage);
      console.error("Submit error in PageForm:", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { heading: "", description: "" }],
    }));
  };

  const updateBenefit = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  const removeBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pageToEdit ? "Edit Slide" : "Create New Slide"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Desktop Title</label>
          <input
            type="text"
            value={formData.titleDesktop}
            onChange={(e) =>
              setFormData({ ...formData, titleDesktop: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Title</label>
          <input
            type="text"
            value={formData.titleMobile}
            onChange={(e) =>
              setFormData({ ...formData, titleMobile: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gradient Words</label>
          <input
            type="text"
            value={formData.gradientWords.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                gradientWords: e.target.value.split(", ").filter(Boolean),
              })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter words separated by commas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gradient Style</label>
          <select
            value={formData.gradient}
            onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a gradient</option>
            {gradientOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Benefits</label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Heading"
                value={benefit.heading || ""}
                onChange={(e) => updateBenefit(index, "heading", e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={benefit.description || ""}
                onChange={(e) =>
                  updateBenefit(index, "description", e.target.value)
                }
                className="w-2/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Benefit
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting
              ? "Saving..."
              : pageToEdit
                ? "Update Slide"
                : "Create Slide"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PageForm;