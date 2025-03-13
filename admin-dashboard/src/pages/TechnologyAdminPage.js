import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import { Trash2, Edit, RefreshCw, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TechnologyForm = ({ pageToEdit, onClose, isOpen }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    sections: [
      { cardType: "highlight", cards: [{ icon: "", title: "", description: "" }] },
    ],
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (pageToEdit) {
      setFormData({
        title: pageToEdit.title || "",
        description: pageToEdit.description || "",
        slug: pageToEdit.slug || "",
        sections: pageToEdit.sections && pageToEdit.sections.length > 0
          ? pageToEdit.sections.map((section) => ({
              cardType: section.cardType || "highlight",
              cards: section.cards && section.cards.length > 0
                ? section.cards.map((card) => ({
                    icon: card.icon || "",
                    title: card.title || "",
                    description: card.description || "",
                  }))
                : [{ icon: "", title: "", description: "" }],
            }))
          : [{ cardType: "highlight", cards: [{ icon: "", title: "", description: "" }] }],
      });
    }
  }, [pageToEdit]);

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
        { cardType: "highlight", cards: [{ icon: "", title: "", description: "" }] },
      ],
    });
  };

  const removeSection = (sectionIndex) => {
    const updatedSections = formData.sections.filter((_, idx) => idx !== sectionIndex);
    setFormData({
      ...formData,
      sections: updatedSections.length > 0
        ? updatedSections
        : [{ cardType: "highlight", cards: [{ icon: "", title: "", description: "" }] }],
    });
  };

  const addCard = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards.push({ icon: "", title: "", description: "" });
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeCard = (sectionIndex, cardIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].cards = updatedSections[sectionIndex].cards.filter((_, idx) => idx !== cardIndex);
    if (updatedSections[sectionIndex].cards.length === 0) {
      updatedSections[sectionIndex].cards.push({ icon: "", title: "", description: "" });
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
    try {
      if (pageToEdit) {
        await axios.put(
          `http://localhost:5000/api/technology/${pageToEdit._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Page updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/technology", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Page created successfully");
      }
      setMessageType("success");
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving page");
      setMessageType("error");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">{pageToEdit ? "Edit Technology Page" : "Create Technology Page"}</h3>
        {message && (
          <div
            className={`p-4 mb-4 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {pageToEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const AdminTechnologyPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState(null);
  const { token } = useAuth();

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/technology", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pagesData = response.data.data || [];
      setPages(Array.isArray(pagesData) ? pagesData : []);
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching pages");
      setMessageType("error");
      setPages([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/technology/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Page deleted successfully");
      setMessageType("success");
      fetchPages();
      setDeleteId(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting page");
      setMessageType("error");
    }
  };

  const handleOpenCreateForm = () => {
    setPageToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (page) => {
    setPageToEdit(page);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setPageToEdit(null);
    fetchPages();
  };

  useEffect(() => {
    fetchPages();
    socket.on("contentUpdated", fetchPages);
    return () => socket.off("contentUpdated");
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Technology Page Manager</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchPages}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" /> New Page
          </button>
        </div>
      </div>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 mb-6 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : !Array.isArray(pages) || pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No technology pages found. Create your first page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pages.map((page) => (
              <motion.div
                key={page._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-4 bg-indigo-600 text-white">
                  <h3 className="text-xl font-bold">{page.title}</h3>
                  <p className="text-sm">/{page.slug}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">{page.description.substring(0, 100)}...</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleOpenEditForm(page)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(page._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {deleteId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this technology page?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {isFormOpen && (
        <TechnologyForm pageToEdit={pageToEdit} onClose={handleCloseForm} isOpen={isFormOpen} />
      )}
    </div>
  );
};

export default AdminTechnologyPage;