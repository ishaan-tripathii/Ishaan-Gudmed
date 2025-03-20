import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import AdminAiPage from "./AdminAiPage";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// Initialize Socket.IO client
const socket = io("http://localhost:5000", {
  autoConnect: true,
  reconnection: true,
});

const AiPageList = () => {
  const { token } = useAuth();
  const [pages, setPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState(null);
  const [error, setError] = useState("");

  // Fetch AI pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ai-pages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPages(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch AI pages");
        console.error(err);
      }
    };

    fetchPages();

    // Listen for real-time updates
    socket.on("contentUpdated", (data) => {
      fetchPages(); // Re-fetch pages on update
    });

    return () => {
      socket.off("contentUpdated");
    };
  }, [token]);

  const handleCreate = () => {
    setPageToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (page) => {
    setPageToEdit(page);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await axios.delete(`http://localhost:5000/api/ai-pages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPages(pages.filter((page) => page._id !== id));
      } catch (err) {
        setError("Failed to delete page");
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPageToEdit(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Pages</h1>
      {error && <div className="p-4 mb-4 bg-red-50 text-red-800 rounded-lg">{error}</div>}
      <button
        onClick={handleCreate}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        <PlusCircle className="h-4 w-4" /> Create New Page
      </button>
      {pages.length === 0 ? (
        <p>No AI pages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Title</th>
                <th className="px-4 py-2 border-b text-left">Slug</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page._id}>
                  <td className="px-4 py-2 border-b">{page.title}</td>
                  <td className="px-4 py-2 border-b">{page.slug}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEdit(page)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(page._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminAiPage
        pageToEdit={pageToEdit}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default AiPageList;