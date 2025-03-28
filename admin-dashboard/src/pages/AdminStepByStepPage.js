import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import config from "../config/config"; // Import the configuration file

const AdminStepByStepPage = () => {
  const [stepByStep, setStepByStep] = useState({
    heading: "🔧 HOW WE WORKS?",
    subheading: "Simplifying Healthcare with GudMed: 🔧",
    description:
      "At GudMed, we believe technology should enhance your work, not complicate it.",
    steps: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Establish Socket.IO connection
    const socket = io(config.socketBaseUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    // Fetch initial data
    const fetchStepByStep = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/step-by-step`);
        setStepByStep({
          heading: response.data.heading || "🔧 HOW WE WORKS?",
          subheading: response.data.subheading || "Simplifying Healthcare with GudMed: 🔧",
          description:
            response.data.description ||
            "At GudMed, we believe technology should enhance your work, not complicate it.",
          steps: response.data.steps || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch step-by-step data");
        setLoading(false);
      }
    };

    fetchStepByStep();

    // Socket.IO event listeners
    socket.on("step_by_step_update", (updatedData) => {
      setStepByStep(updatedData);
      toast.success("Step-by-step data updated in real-time!");
    });

    socket.on("step_by_step_create", (newData) => {
      setStepByStep(newData);
      toast.success("New step-by-step data created!");
    });

    socket.on("step_by_step_delete", () => {
      setStepByStep({ heading: "", subheading: "", description: "", steps: [] });
      toast.success("Step-by-step data deleted!");
    });

    // Cleanup on unmount
    return () => {
      socket.off("step_by_step_update");
      socket.off("step_by_step_create");
      socket.off("step_by_step_delete");
      socket.disconnect();
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
      await axios.put(`${config.apiBaseUrl}/api/step-by-step`, stepByStep, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Changes saved successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating step-by-step data");
      toast.error(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    setStepByStep((prev) => ({
      ...prev,
      steps: [...prev.steps, { title: "", description: "", icon: "" }],
    }));
    toast.success("New step added!");
  };

  const handleStepChange = (index, field, value) => {
    setStepByStep((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
    }));
  };

  const handleDeleteStep = (index) => {
    if (!window.confirm("Are you sure you want to delete this step?")) return;
    setStepByStep((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
    toast.success("Step deleted!");
  };

  const moveStepUp = (index) => {
    if (index === 0) return;
    setStepByStep((prev) => {
      const steps = [...prev.steps];
      [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
      return { ...prev, steps };
    });
  };

  const moveStepDown = (index) => {
    if (index === stepByStep.steps.length - 1) return;
    setStepByStep((prev) => {
      const steps = [...prev.steps];
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
      return { ...prev, steps };
    });
  };

  const handleFieldChange = (field, value) => {
    setStepByStep((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Step-by-Step Section</h1>
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Section Header</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Heading</label>
                <input
                  type="text"
                  value={stepByStep.heading}
                  onChange={(e) => handleFieldChange("heading", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 🔧 HOW WE WORKS?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Subheading</label>
                <input
                  type="text"
                  value={stepByStep.subheading}
                  onChange={(e) => handleFieldChange("subheading", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Simplifying Healthcare with GudMed: 🔧"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  value={stepByStep.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., At GudMed, we believe technology should enhance your work..."
                  rows="4"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Steps</h2>
            {stepByStep.steps.map((step, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
              >
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, "title", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title (e.g., Step 1)"
                  required
                />
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(index, "description", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description (e.g., Doctors continue to write...)"
                  rows="3"
                  required
                />
                <input
                  type="text"
                  value={step.icon}
                  onChange={(e) => handleStepChange(index, "icon", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Icon URL (e.g., https://example.com/icon.png)"
                />
                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStepDown(index)}
                    disabled={index === stepByStep.steps.length - 1}
                    className={`p-2 rounded-lg text-white ${index === stepByStep.steps.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStep(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Step
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

export default AdminStepByStepPage;