import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend

const AdminAIPage = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    cards: [],
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchPages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ai-pages", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch pages");
      const data = await response.json();
      setPages(Array.isArray(data) ? data : [data]);
      setError("");
    } catch (err) {
      console.error("Error fetching pages:", err);
      setError("Failed to load pages. Please try again.");
    }
  };

  useEffect(() => {
    fetchPages();

    // Listen for real-time updates
    socket.on("pagesUpdated", () => {
      fetchPages(); // Refetch pages when notified
    });

    // Cleanup on unmount
    return () => {
      socket.off("pagesUpdated");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      return;
    }
    const method = currentPage ? "PUT" : "POST";
    const url = currentPage
      ? `http://localhost:5000/api/ai-pages/${currentPage._id}`
      : "http://localhost:5000/api/ai-pages";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save page");
      }
      await fetchPages();
      setFormData({ title: "", description: "", slug: "", cards: [] });
      setCurrentPage(null);
      setError("");
    } catch (err) {
      console.error("Error saving page:", err);
      setError(err.message || "Error saving page. Please try again.");
    }
  };

  const handleEdit = (page) => {
    setCurrentPage(page);
    setFormData(page);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("Please log in to perform this action.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this page?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/ai-pages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete page");
      }
      await fetchPages();
      setError("");
    } catch (err) {
      console.error("Error deleting page:", err);
      setError(err.message || "Error deleting page. Please try again.");
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { icon: "", title: "", description: "" }],
    });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = formData.cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleDeleteCard = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (!confirmDelete) return;

    const updatedCards = formData.cards.filter((_, i) => i !== index);
    setFormData({ ...formData, cards: updatedCards });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - AI Pages</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <h2 className="text-xl font-semibold mb-2">Cards</h2>
        {formData.cards.map((card, index) => (
          <div key={index} className="mb-4 p-4 border rounded flex flex-col">
            <input
              type="text"
              placeholder="Icon (e.g., fa/FaClock, md/MdOutlineStar)"
              value={card.icon}
              onChange={(e) => handleCardChange(index, "icon", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Title"
              value={card.title}
              onChange={(e) => handleCardChange(index, "title", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={card.description}
              onChange={(e) => handleCardChange(index, "description", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleDeleteCard(index)}
              className="bg-red-500 text-white p-1 rounded self-end"
            >
              Delete Card
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          Add Card
        </button>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {currentPage ? "Update" : "Create"} Page
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Existing Pages</h2>
      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page._id} className="flex justify-between p-2 border rounded">
            <span>{page.title}</span>
            <div>
              <button
                onClick={() => handleEdit(page)}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(page._id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete Page
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAIPage;