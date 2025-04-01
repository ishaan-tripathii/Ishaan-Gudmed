import React, { useState, useEffect } from "react";
import { FaHospital, FaRobot, FaChartBar, FaRegPaperPlane, FaHeartbeat, FaMedkit, FaClipboardCheck } from "react-icons/fa";
import { FiSettings, FiActivity } from "react-icons/fi";
import { PlusCircle, Edit2, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import pagesService from '../../services/api/pagesService';
import io from 'socket.io-client';

// Use environment variable for socket connection
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

const iconMap = {
  FaHospital,
  FaChartBar,
  FiSettings,
  FiActivity,
  FaRegPaperPlane,
  FaRobot,
  FaHeartbeat,
  FaMedkit,
  FaClipboardCheck,
};

const TechnologyManager = () => {
  const { token } = useAuth();
  const [technologies, setTechnologies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    sections: [
      { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
    ],
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch technologies
  const fetchTechnologies = async () => {
    try {
      setIsLoading(true);
      const response = await pagesService.getTechnologyList();
      const techData = response?.data || [];
      setTechnologies(Array.isArray(techData) ? techData : []);
    } catch (err) {
      console.error("Error fetching technologies:", err);
      toast.error("Failed to load technologies");
    } finally {
      setIsLoading(false);
    }
  };

  // Socket event handlers
  useEffect(() => {
    // Listen for technology updates
    socket.on("technology:create", (newTech) => {
      console.log("New technology created:", newTech);
      setTechnologies(prev => [...prev, newTech]);
    });

    socket.on("technology:update", (updatedTech) => {
      console.log("Technology updated:", updatedTech);
      setTechnologies(prev =>
        prev.map(tech => tech._id === updatedTech._id ? updatedTech : tech)
      );
    });

    socket.on("technology:delete", (deletedTech) => {
      console.log("Technology deleted:", deletedTech);
      setTechnologies(prev =>
        prev.filter(tech => tech._id !== deletedTech._id)
      );
    });

    // Cleanup socket listeners
    return () => {
      socket.off("technology:create");
      socket.off("technology:update");
      socket.off("technology:delete");
    };
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleCreate = async (data) => {
    try {
      const response = await pagesService.createTechnology(data);
      // Emit socket event for real-time update
      socket.emit("technology:create", response.data);
      toast.success("Technology created successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to create technology");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const response = await pagesService.updateTechnology(id, data);
      // Emit socket event for real-time update
      socket.emit("technology:update", response.data);
      toast.success("Technology updated successfully");
      setIsEditing(false);
      setSelectedTech(null);
    } catch (err) {
      toast.error("Failed to update technology");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technology?")) return;
    try {
      await pagesService.deleteTechnology(id);
      // Emit socket event for real-time update
      socket.emit("technology:delete", { _id: id });
      toast.success("Technology deleted successfully");
    } catch (err) {
      toast.error("Failed to delete technology");
    }
  };

  // Handle form input changes
  const handleChange = (e, sectionIndex, cardIndex) => {
    const { name, value } = e.target;
    if (sectionIndex !== undefined && cardIndex !== undefined) {
      const updatedSections = [...formData.sections];
      updatedSections[sectionIndex].cards[cardIndex][name] = value;
      setFormData({ ...formData, sections: updatedSections });
    } else if (sectionIndex !== undefined) {
      const updatedSections = [...formData.sections];
      updatedSections[sectionIndex][name] = value;
      setFormData({ ...formData, sections: updatedSections });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new section
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
      ],
    });
  };

  // Remove a section
  const removeSection = (sectionIndex) => {
    const updatedSections = formData.sections.filter((_, idx) => idx !== sectionIndex);
    setFormData({
      ...formData,
      sections: updatedSections.length > 0 ? updatedSections : [{ cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] }],
    });
  };

  // Add a new card to a section
  const addCard = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards.push({ icon: "", color: "", title: "", description: "" });
    setFormData({ ...formData, sections: updatedSections });
  };

  // Remove a card from a section
  const removeCard = (sectionIndex, cardIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards = updatedSections[sectionIndex].cards.filter((_, idx) => idx !== cardIndex);
    if (updatedSections[sectionIndex].cards.length === 0) {
      updatedSections[sectionIndex].cards.push({ icon: "", color: "", title: "", description: "" });
    }
    setFormData({ ...formData, sections: updatedSections });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.slug) {
      setMessage("Title, description, and slug are required.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await handleUpdate(selectedTech, formData);
      } else {
        response = await handleCreate(formData);
      }
      setMessageType("success");
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving technology");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Populate form with technology data for editing
  const handleEdit = (tech) => {
    setIsEditing(true);
    setSelectedTech(tech._id);
    setFormData({
      title: tech.title,
      description: tech.description,
      slug: tech.slug,
      sections: tech.sections.map((section) => ({
        cardType: section.cardType,
        cards: section.cards.map((card) => ({
          icon: card.icon,
          color: card.color,
          title: card.title,
          description: card.description,
        })),
      })),
    });
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      slug: "",
      sections: [
        { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
      ],
    });
    setIsEditing(false);
    setSelectedTech(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Technology Manager</h1>

        {/* Message Display */}
        {message && (
          <div className={`p-4 mb-4 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message}
          </div>
        )}

        {/* Form for Creating or Editing Technology */}
        <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Technology" : "Create New Technology"}</h2>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-lg"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {formData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Section {sectionIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Card Type</label>
                <select
                  name="cardType"
                  value={section.cardType}
                  onChange={(e) => handleChange(e, sectionIndex)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="highlight">Highlight</option>
                  <option value="motion">Motion</option>
                </select>
              </div>
              {section.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-md font-medium">Card {cardIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeCard(sectionIndex, cardIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1">Icon (e.g., FaChartBar)</label>
                    <input
                      type="text"
                      name="icon"
                      value={card.icon}
                      onChange={(e) => handleChange(e, sectionIndex, cardIndex)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., FaChartBar"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1">Color (e.g., #4F46E5)</label>
                    <input
                      type="text"
                      name="color"
                      value={card.color}
                      onChange={(e) => handleChange(e, sectionIndex, cardIndex)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., #4F46E5"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={card.title}
                      onChange={(e) => handleChange(e, sectionIndex, cardIndex)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={card.description}
                      onChange={(e) => handleChange(e, sectionIndex, cardIndex)}
                      className="w-full p-2 border rounded-lg"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addCard(sectionIndex)}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <PlusCircle className="h-4 w-4" /> Add Card
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <PlusCircle className="h-4 w-4" /> Add Section
          </button>
          <div className="flex justify-end gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Saving..." : isEditing ? "Update Technology" : "Create Technology"}
            </button>
          </div>
        </form>

        {/* List of Existing Technologies */}
        <h2 className="text-2xl font-bold mb-4">Existing Technologies</h2>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : technologies.length === 0 ? (
          <p>No technologies found.</p>
        ) : (
          <ul className="space-y-4">
            {technologies.map((tech) => (
              <li key={tech._id} className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-xl font-semibold">{tech.title}</h3>
                <p className="text-gray-600">{tech.description}</p>
                <p className="text-sm text-gray-500">Slug: {tech.slug}</p>
                <div className="mt-2">
                  {tech.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="mb-4">
                      <h4 className="text-lg font-medium">Section {sectionIdx + 1} ({section.cardType})</h4>
                      <ul className="ml-4 space-y-2">
                        {section.cards.map((card, cardIdx) => (
                          <li key={cardIdx} className="border p-2 rounded-md">
                            <p><strong>Icon:</strong> {card.icon || "None"}</p>
                            <p><strong>Color:</strong> {card.color || "None"}</p>
                            <p><strong>Title:</strong> {card.title}</p>
                            <p><strong>Description:</strong> {card.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(tech)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    <Edit2 className="h-4 w-4 inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tech._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 inline mr-1" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TechnologyManager;