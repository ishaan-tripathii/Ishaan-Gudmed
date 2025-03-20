import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const WhyGudMedisUnique = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    cards: [],
    footer: { title: "", description: "", ctaText: "", ctaLink: "" },
  });
  const [socket, setSocket] = useState(null); // Manage socket in state
  const token = localStorage.getItem("token");

  // Fetch pages from the server
  const fetchPages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/why-gudmed");
      setPages(response.data.data || []);
    } catch (err) {
      console.error("Error fetching pages:", err);
      toast.error("Failed to load pages.");
    }
  };

  // Setup Socket.IO and fetch pages on mount
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Socket connected"));
    newSocket.on("whyGudMedUpdated", () => {
      console.log("Received whyGudMedUpdated event");
      fetchPages();
    });
    newSocket.on("connect_error", (err) => console.log("Socket error:", err));

    fetchPages();

    // Cleanup on unmount
    return () => {
      newSocket.off("whyGudMedUpdated");
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in.");
      return;
    }
    const method = currentPage ? "put" : "post";
    const url = currentPage
      ? `http://localhost:5000/api/why-gudmed/${currentPage._id}`
      : "http://localhost:5000/api/why-gudmed";

    try {
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });
      toast.success(currentPage ? "Page updated!" : "Page created!");
      socket?.emit("whyGudMedUpdated", { type: "why-gudmed" });
      await fetchPages();
      setFormData({
        title: "",
        description: "",
        slug: "",
        cards: [],
        footer: { title: "", description: "", ctaText: "", ctaLink: "" },
      });
      setCurrentPage(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving page.");
    }
  };

  const handleEdit = (page) => {
    setCurrentPage(page);
    setFormData({
      title: page.title || "",
      description: page.description || "",
      slug: page.slug || "",
      cards: Array.isArray(page.cards) ? [...page.cards] : [],
      footer: {
        title: page.footer?.title || "",
        description: page.footer?.description || "",
        ctaText: page.footer?.ctaText || "",
        ctaLink: page.footer?.ctaLink || "",
      },
    });
  };

  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Please log in.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/why-gudmed/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Page deleted!");
      socket?.emit("whyGudMedUpdated", { type: "why-gudmed" });
      await fetchPages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting page.");
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { icon: "", title: "", description: "", points: [] }],
    });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = formData.cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    setFormData({ ...formData, cards: updatedCards });
  };

  const addPoint = (cardIndex) => {
    const updatedCards = formData.cards.map((card, i) =>
      i === cardIndex
        ? { ...card, points: [...(card.points || []), { icon: "", text: "" }] }
        : card
    );
    setFormData({ ...formData, cards: updatedCards });
  };

  const handlePointChange = (cardIndex, pointIndex, field, value) => {
    const updatedCards = formData.cards.map((card, i) =>
      i === cardIndex
        ? {
            ...card,
            points: card.points.map((point, j) =>
              j === pointIndex ? { ...point, [field]: value } : point
            ),
          }
        : card
    );
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleDeleteCard = (index) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    const updatedCards = formData.cards.filter((_, i) => i !== index);
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleDeletePoint = (cardIndex, pointIndex) => {
    if (!window.confirm("Are you sure you want to delete this point?")) return;
    const updatedCards = formData.cards.map((card, i) =>
      i === cardIndex
        ? { ...card, points: card.points.filter((_, j) => j !== pointIndex) }
        : card
    );
    setFormData({ ...formData, cards: updatedCards });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin - Why GudMed is Unique</h1>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
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
          <textarea
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
        {(formData.cards || []).map((card, cardIndex) => (
          <div key={cardIndex} className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Icon (e.g., FaClock)"
              value={card.icon}
              onChange={(e) => handleCardChange(cardIndex, "icon", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Title"
              value={card.title}
              onChange={(e) => handleCardChange(cardIndex, "title", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              placeholder="Description"
              value={card.description}
              onChange={(e) => handleCardChange(cardIndex, "description", e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <h3 className="text-lg font-medium mb-2">Points</h3>
            {(card.points || []).map((point, pointIndex) => (
              <div key={pointIndex} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Point Icon (e.g., FaClock)"
                  value={point.icon}
                  onChange={(e) =>
                    handlePointChange(cardIndex, pointIndex, "icon", e.target.value)
                  }
                  className="w-1/3 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Point Text"
                  value={point.text}
                  onChange={(e) =>
                    handlePointChange(cardIndex, pointIndex, "text", e.target.value)
                  }
                  className="w-2/3 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePoint(cardIndex, pointIndex)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPoint(cardIndex)}
              className="bg-blue-500 text-white p-1 rounded mb-2"
            >
              Add Point
            </button>
            <button
              type="button"
              onClick={() => handleDeleteCard(cardIndex)}
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
        <h2 className="text-xl font-semibold mb-2 mt-4">Footer</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Footer Title"
            value={formData.footer.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                footer: { ...formData.footer, title: e.target.value },
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Footer Description"
            value={formData.footer.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                footer: { ...formData.footer, description: e.target.value },
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="CTA Text"
            value={formData.footer.ctaText}
            onChange={(e) =>
              setFormData({
                ...formData,
                footer: { ...formData.footer, ctaText: e.target.value },
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="CTA Link"
            value={formData.footer.ctaLink}
            onChange={(e) =>
              setFormData({
                ...formData,
                footer: { ...formData.footer, ctaLink: e.target.value },
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          {currentPage ? "Update" : "Create"} Page
        </button>
      </form>
      <h2 className="text-xl font-semibold mb-2">Existing Pages</h2>
      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page._id} className="flex justify-between p-2 border rounded">
            <span>{page.title || "Untitled"}</span>
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
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhyGudMedisUnique;