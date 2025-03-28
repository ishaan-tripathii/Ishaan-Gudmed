import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from "axios";
import config from "../../config"; // Import the config file

const WhyGudMedManager = () => {
  const [pages, setPages] = useState([]);// fetchning from backend 
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);// Stores the currently selected page.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    cards: [],
    footer: { title: "", description: "", ctaText: "", ctaLink: "" },
  });

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.apiBaseUrl}/api/why-gudmed`); // Use config.apiBaseUrl
        setPages(response.data.data || []);
      } catch (err) {
        toast.error("Failed to load pages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();

    socket.on("connect", () => {
      // Removed console.log
    });

    socket.on("whyGudMed_created", (newPage) => {
      setPages((prev) => [...prev, newPage]);
      toast.success("New Why GudMed page created!");
    });

    socket.on("whyGudMed_updated", (updatedPage) => {
      setPages((prev) =>
        prev.map((page) => (page._id === updatedPage._id ? updatedPage : page))
      );
      toast.success("Why GudMed page updated!");
    });

    socket.on("whyGudMed_deleted", (deletedData) => {
      setPages((prev) => prev.filter((page) => page._id !== deletedData._id));
      toast.info("Why GudMed page deleted!");
    });

    socket.on("connect_error", (err) => {
      // Removed console.log
    });

    return () => {
      socket.off("connect");
      socket.off("whyGudMed_created");
      socket.off("whyGudMed_updated");
      socket.off("whyGudMed_deleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      slug: "",
      cards: [],
      footer: { title: "", description: "", ctaText: "", ctaLink: "" },
    });
    setCurrentPage(null);
  };

  const handleEdit = (page) => {
    setCurrentPage(page);
    setFormData({
      title: page.title || "",
      description: page.description || "",
      slug: page.slug || "",
      cards: Array.isArray(page.cards)
        ? page.cards.map((card) => ({
          icon: card.icon || "",
          title: card.title || "",
          description: card.description || "",
          points: Array.isArray(card.points) ? [...card.points] : [],
        }))
        : [],
      footer: {
        title: page.footer?.title || "",
        description: page.footer?.description || "",
        ctaText: page.footer?.ctaText || "",
        ctaLink: page.footer?.ctaLink || "",
      },
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await axios.delete(`${config.apiBaseUrl}/api/why-gudmed/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Add auth if needed
      });
      toast.success("Page deleted successfully");
    } catch (err) {
      toast.error("Failed to delete page");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentPage) {
        await axios.put(
          `${config.apiBaseUrl}/api/why-gudmed/${currentPage._id}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // Add auth if needed
        );
        toast.success("Page updated successfully");
      } else {
        await axios.post(`${config.apiBaseUrl}/api/why-gudmed`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Add auth if needed
        });
        toast.success("Page created successfully");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save page");
    } finally {
      setIsLoading(false);
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

  const handleDeleteCard = (index) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    const updatedCards = formData.cards.filter((_, i) => i !== index);
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
      <h1 className="text-3xl font-bold flex  mb-6">Why GudMed Manager</h1>
      <ToastContainer />

      <h2 className="text-2xl font-semibold mb-4">
        {currentPage ? "Edit Page" : "Create New Page"}
      </h2>
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

        <h3 className="text-xl font-semibold mb-2">Cards</h3>
        {Array.isArray(formData.cards) &&
          formData.cards.map((card, cardIndex) => (
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
              <h4 className="text-lg font-medium mb-2">Points</h4>
              {Array.isArray(card.points) &&
                card.points.map((point, pointIndex) => (
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
                className="bg-red-500 text-white p-1 rounded"
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

        <h3 className="text-xl font-semibold mb-2 mt-4">Footer</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Footer Title"
            value={formData.footer.title}
            onChange={(e) =>
              setFormData({ ...formData, footer: { ...formData.footer, title: e.target.value } })
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
              setFormData({ ...formData, footer: { ...formData.footer, ctaText: e.target.value } })
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
              setFormData({ ...formData, footer: { ...formData.footer, ctaLink: e.target.value } })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-2">
          {currentPage && (
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
            className={`bg-green-500 text-white p-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Saving..." : currentPage ? "Update" : "Create"} Page
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Pages</h2>
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
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
      )}
    </div>
  );
};

export default WhyGudMedManager;