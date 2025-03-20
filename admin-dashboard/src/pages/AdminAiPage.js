import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Trash2, PlusCircle, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

const socket = io("http://localhost:5000", {
  autoConnect: true,
  reconnection: true,
});

const AdminAiPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    title: "",
    titleColor: "#000000",
    description: "",
    slug: "",
    sections: [
      { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
    ],
  });
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPageId, setEditPageId] = useState(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Please log in to view pages.");
      const response = await axios.get("http://localhost:5000/api/ai-pages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedPages = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setPages(fetchedPages);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch pages");
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("aiPageUpdated", (updatedPage) => {
      console.log("Socket received aiPageUpdated:", updatedPage);
      setPages((prevPages) => {
        const currentPages = Array.isArray(prevPages) ? prevPages : [];
        if (updatedPage.deleted) {
          return currentPages.filter((page) => page._id !== updatedPage._id);
        }
        const exists = currentPages.some((page) => page._id === updatedPage._id);
        if (exists) {
          return currentPages.map((page) =>
            page._id === updatedPage._id ? updatedPage : page
          );
        } else {
          return [...currentPages, updatedPage];
        }
      });
      toast.success("Page updated in real-time");
    });

    socket.on("whyGudMedUpdated", (updatedPage) => {
      console.log("Socket received whyGudMedUpdated:", updatedPage);
    });

    return () => {
      socket.off("aiPageUpdated");
      socket.off("whyGudMedUpdated");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [token]);

  const handleChange = (e, sectionIndex, cardIndex) => {
    const { name, value } = e.target;
    if (sectionIndex !== undefined && cardIndex !== undefined) {
      const updatedSections = formData.sections.map((section, sIdx) =>
        sIdx === sectionIndex
          ? {
              ...section,
              cards: section.cards.map((card, cIdx) =>
                cIdx === cardIndex ? { ...card, [name]: value } : card
              ),
            }
          : section
      );
      setFormData({ ...formData, sections: updatedSections });
    } else if (sectionIndex !== undefined) {
      const updatedSections = formData.sections.map((section, sIdx) =>
        sIdx === sectionIndex ? { ...section, [name]: value } : section
      );
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
      sections:
        updatedSections.length > 0
          ? updatedSections
          : [{ cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] }],
    });
  };

  const addCard = (sectionIndex) => {
    const updatedSections = formData.sections.map((section, sIdx) =>
      sIdx === sectionIndex
        ? {
            ...section,
            cards: [...section.cards, { icon: "", color: "", title: "", description: "" }],
          }
        : section
    );
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeCard = (sectionIndex, cardIndex) => {
    const updatedSections = formData.sections.map((section, sIdx) =>
      sIdx === sectionIndex
        ? {
            ...section,
            cards: section.cards.filter((_, cIdx) => cIdx !== cardIndex).length
              ? section.cards.filter((_, cIdx) => cIdx !== cardIndex)
              : [{ icon: "", color: "", title: "", description: "" }],
          }
        : section
    );
    setFormData({ ...formData, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.slug) {
      toast.error("Title, description, and slug are required.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editMode) {
        response = await axios.put(
          `http://localhost:5000/api/ai-pages/${editPageId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("AI Page updated successfully");
        socket.emit("aiPageUpdated", response.data.data);
      } else {
        response = await axios.post("http://localhost:5000/api/ai-pages", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("AI Page created successfully");
        socket.emit("aiPageUpdated", response.data.data);
      }
      await fetchPages();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving AI page");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditMode(true);
    setEditPageId(page._id);
    setFormData({
      title: page.title || "",
      titleColor: page.titleColor || "#000000",
      description: page.description || "",
      slug: page.slug || "",
      sections: Array.isArray(page.sections)
        ? page.sections.map((section) => ({
            cardType: section.cardType || "highlight",
            cards: Array.isArray(section.cards)
              ? section.cards.map((card) => ({
                  icon: card.icon || "",
                  color: card.color || "",
                  title: card.title || "",
                  description: card.description || "",
                }))
              : [{ icon: "", color: "", title: "", description: "" }],
          }))
        : [{ cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] }],
    });
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm("Are you sure you want to delete this AI page?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/ai-pages/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("AI Page deleted successfully");
      socket.emit("aiPageUpdated", { _id: pageId, deleted: true });
      await fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting AI page");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleColor: "#000000",
      description: "",
      slug: "",
      sections: [
        { cardType: "highlight", cards: [{ icon: "", color: "", title: "", description: "" }] },
      ],
    });
    setEditMode(false);
    setEditPageId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-6 max-w-4xl"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/* Add Toaster */}
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">AI Page Manager</h1>

        <h2 className="text-2xl font-semibold mb-4">{editMode ? "Edit AI Page" : "Create New AI Page"}</h2>
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
            <label className="block text-gray-700 font-medium mb-2">Title Color (Hex or CSS Color)</label>
            <input
              type="text"
              name="titleColor"
              value={formData.titleColor}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., #FF0000 or red"
            />
            <input
              type="color"
              name="titleColor"
              value={formData.titleColor}
              onChange={(e) => handleChange(e)}
              className="mt-2 w-16 h-10 p-1 border rounded-lg"
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

          {(formData.sections || []).map((section, sectionIndex) => (
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
              {(section.cards || []).map((card, cardIndex) => (
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
                      placeholder="e.g., FaBeer"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-1">
                      Icon Color (Tailwind class, e.g., text-red-500)
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={card.color}
                      onChange={(e) => handleChange(e, sectionIndex, cardIndex)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., text-blue-500"
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
            {editMode && (
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
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : editMode ? "Update Page" : "Create Page"}
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-bold mb-4">Existing AI Pages</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : pages.length === 0 ? (
          <p>No AI pages found.</p>
        ) : (
          <ul className="space-y-4">
            {pages.map((page) => (
              <li key={page._id} className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-xl font-semibold">{page.title}</h3>
                <p className="text-gray-600">Title Color: {page.titleColor || "Not set"}</p>
                <p className="text-gray-600">{page.description}</p>
                <p className="text-sm text-gray-500">Slug: {page.slug}</p>
                <div className="mt-2">
                  {(page.sections || []).map((section, sectionIdx) => (
                    <div key={sectionIdx} className="mb-4">
                      <h4 className="text-lg font-medium">Section {sectionIdx + 1} ({section.cardType})</h4>
                      <ul className="ml-4 space-y-2">
                        {(section.cards || []).map((card, cardIdx) => (
                          <li key={cardIdx} className="border p-2 rounded-md">
                            <p><strong>Icon:</strong> {card.icon || "None"}</p>
                            <p><strong>Color:</strong> {card.color || "None"}</p>
                            <p><strong>Title:</strong> {card.title || "Untitled"}</p>
                            <p><strong>Description:</strong> {card.description || "No description"}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(page)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    <Edit2 className="h-4 w-4 inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page._id)}
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
    </motion.div>
  );
};

export default AdminAiPage;