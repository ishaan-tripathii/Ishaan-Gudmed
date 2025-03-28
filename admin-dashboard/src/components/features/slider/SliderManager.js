// src/components/SliderManager.jsx
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from "axios";
import config from "../../../config"; // Import the config file

// API and Socket.IO configuration
const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const SliderManager = () => {
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlider, setCurrentSlider] = useState(null);
  const [formData, setFormData] = useState({
    titleDesktop: "",
    titleMobile: "",
    gradientWords: [],
    gradient: "",
    benefits: [],
    slug: "",
  });

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/pages");
        setSliders(response.data || []);
      } catch (err) {
        toast.error("Failed to load sliders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();

    socket.on("connect", () => {
      // Removed console.log
    });

    socket.on("pageCreated", (newPage) => {
      setSliders((prev) => [...prev, newPage]);
      toast.success("New slider created in real-time!");
    });

    socket.on("pageUpdated", (updatedPage) => {
      setSliders((prev) =>
        prev.map((slider) => (slider._id === updatedPage._id ? updatedPage : slider))
      );
      toast.success("Slider updated in real-time!");
    });

    socket.on("pageDeleted", (slug) => {
      setSliders((prev) => prev.filter((slider) => slider.slug !== slug));
      toast.success("Slider deleted in real-time!");
    });

    socket.on("connect_error", (err) => {
      // Removed console.log
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const resetForm = () => {
    setFormData({
      titleDesktop: "",
      titleMobile: "",
      gradientWords: [],
      gradient: "",
      benefits: [],
      slug: "",
    });
    setCurrentSlider(null);
  };

  const handleEdit = (slider) => {
    setCurrentSlider(slider);
    setFormData({
      titleDesktop: slider.titleDesktop || "",
      titleMobile: slider.titleMobile || "",
      gradientWords: Array.isArray(slider.gradientWords) ? slider.gradientWords : [],
      gradient: slider.gradient || "",
      benefits: Array.isArray(slider.benefits) ? slider.benefits : [],
      slug: slider.slug || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider?")) return;
    try {
      await api.delete(`/pages/${id}`);
      toast.success("Slider deleted successfully");
    } catch (err) {
      toast.error("Failed to delete slider");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (currentSlider) {
        response = await api.put(`/pages/${currentSlider._id}`, formData);
        toast.success("Slider updated successfully");
      } else {
        response = await api.post("/pages", formData);
        toast.success("Slider created successfully");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save slider");
    } finally {
      setIsLoading(false);
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Slider Manager</h1>
      <ToastContainer />

      <h2 className="text-2xl font-semibold mb-4">
        {currentSlider ? "Edit Slider" : "Create New Slider"}
      </h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title Desktop</label>
          <input
            type="text"
            placeholder="Title Desktop"
            value={formData.titleDesktop}
            onChange={(e) => setFormData({ ...formData, titleDesktop: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title Mobile</label>
          <input
            type="text"
            placeholder="Title Mobile"
            value={formData.titleMobile}
            onChange={(e) => setFormData({ ...formData, titleMobile: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gradient Words (comma-separated)</label>
          <input
            type="text"
            placeholder="Gradient Words (comma-separated)"
            value={formData.gradientWords.join(", ")}
            onChange={(e) =>
              setFormData({ ...formData, gradientWords: e.target.value.split(", ").filter(Boolean) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gradient</label>
          <input
            type="text"
            placeholder="Gradient (e.g., bg-gradient-to-r from-purple-400 via-pink-500 to-red-500)"
            value={formData.gradient}
            onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
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
                className="w-1/3 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={benefit.description || ""}
                onChange={(e) => updateBenefit(index, "description", e.target.value)}
                className="w-2/3 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Add Benefit
          </button>
        </div>
        <div className="flex gap-2">
          {currentSlider && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-500 text-white p-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Saving..." : currentSlider ? "Update" : "Create"} Slider
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Sliders</h2>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : sliders.length === 0 ? (
        <p>No sliders found.</p>
      ) : (
        <ul className="space-y-2">
          {sliders.map((slider) => (
            <li key={slider._id} className="flex justify-between p-2 border rounded">
              <div>
                <h4 className="font-semibold">{slider.titleDesktop}</h4>
                <p className="text-gray-600">{slider.titleMobile}</p>
                <p className="text-gray-600">Slug: {slider.slug}</p>
                {slider.benefits && slider.benefits.length > 0 && (
                  <ul className="text-gray-600 list-disc pl-5">
                    {slider.benefits.map((benefit, i) => (
                      <li key={i}>{benefit.heading}: {benefit.description}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(slider)}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SliderManager;