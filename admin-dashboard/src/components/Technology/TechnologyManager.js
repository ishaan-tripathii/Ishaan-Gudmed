import React, { useState, useEffect } from "react";
import { FaHospital, FaRobot, FaChartBar, FaRegPaperPlane, FaHeartbeat, FaMedkit, FaClipboardCheck } from "react-icons/fa";
import { FiSettings, FiActivity } from "react-icons/fi";
import { PlusCircle, Edit2, Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";
import config from "../../config/config"; // Adjust the relative path as needed

const SOCKET_URL = config.socketBaseUrl;

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
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchTechnologies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.apiBaseUrl}/api/technology`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const techData = response.data.data || [];
        setTechnologies(Array.isArray(techData) ? techData : []);
      } catch (err) {
        toast.error("Failed to load technologies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnologies();

    socket.on("connect", () => {
      // Removed console.log
    });

    socket.on("technology_created", (newTech) => {
      setTechnologies((prev) => [...prev, newTech]);
      toast.success("New technology added in real-time!");
    });

    socket.on("technology_updated", (updatedTech) => {
      setTechnologies((prev) =>
        prev.map((tech) => (tech._id === updatedTech._id ? updatedTech : tech))
      );
      toast.success("Technology updated in real-time!");
    });

    socket.on("technology_deleted", (deletedTech) => {
      setTechnologies((prev) => prev.filter((tech) => tech._id !== deletedTech.id));
      toast.success("Technology deleted in real-time!");
    });

    socket.on("connect_error", (err) => {
      // Removed console.log
    });

    return () => {
      socket.off("connect");
      socket.off("technology_created");
      socket.off("technology_updated");
      socket.off("technology_deleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [token]);

  const handleCreate = async (data) => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/technology`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnologies((prev) => [...prev, response.data.data]);
      toast.success("Technology created successfully");
      return response.data.data;
    } catch (err) {
      toast.error("Failed to create technology");
      throw err;
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const response = await axios.put(`${config.apiBaseUrl}/api/technology/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnologies((prev) =>
        prev.map((tech) => (tech._id === id ? response.data.data : tech))
      );
      toast.success("Technology updated successfully");
      return response.data.data;
    } catch (err) {
      toast.error("Failed to update technology");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technology?")) return;
    try {
      await axios.delete(`${config.apiBaseUrl}/api/technology/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnologies((prev) => prev.filter((tech) => tech._id !== id));
      toast.success("Technology deleted successfully");
    } catch (err) {
      toast.error("Failed to delete technology");
    }
  };

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

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
      ],
    });
  };

  const removeSection = (sectionIndex) => {
    const updatedSections = formData.sections.filter((_, idx) => idx !== sectionIndex);
    setFormData({
      ...formData,
      sections: updatedSections.length > 0 ? updatedSections : [{ cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] }],
    });
  };

  const addCard = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards.push({ icon: "", color: "", title: "", description: "" });
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeCard = (sectionIndex, cardIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards = updatedSections[sectionIndex].cards.filter((_, idx) => idx !== cardIndex);
    if (updatedSections[sectionIndex].cards.length === 0) {
      updatedSections[sectionIndex].cards.push({ icon: "", color: "", title: "", description: "" });
    }
    setFormData({ ...formData, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.slug) {
      setMessage("Title, description, and slug are required.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await handleUpdate(selectedTech, formData);
      } else {
        await handleCreate(formData);
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
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Technology Manager</h1>

        {message && (
          <div className={`p-4 mb-4 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message}
          </div>
        )}

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