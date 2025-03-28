import React, { useState, useEffect } from "react";
import { RefreshCw, Edit, Trash2, PlusCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../common/Modal";
import Card from "../common/Card";
import PageForm from "../PageForm";
import axios from "axios";
import io from "socket.io-client";
import config from "../../config/config"; // Adjust the path if needed

const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const Button = ({ variant, icon, children, onClick }) => {
  const baseStyles = "px-4 py-2 rounded text-sm font-medium flex items-center gap-2";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    icon: "p-2 bg-transparent text-gray-600 hover:bg-gray-100 rounded-full",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || ""}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
};

const SliderManager = () => {
  const [pages, setPages] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const fetchPages = async () => {
      try {
        const response = await api.get("/pages");
        setPages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setMessage("Error fetching pages");
        setMessageType("error");
      }
    };

    fetchPages();

    socket.on("connect", () => {
      setMessage("Socket.IO connected");
      setMessageType("info");
    });

    socket.on("pageCreated", (newPage) => {
      setPages((prev) => [...prev, newPage]);
      setMessage("New slide created in real-time!");
      setMessageType("success");
    });

    socket.on("pageUpdated", (updatedPage) => {
      setPages((prev) =>
        prev.map((page) => (page._id === updatedPage._id ? updatedPage : page))
      );
      setMessage("Slide updated in real-time!");
      setMessageType("success");
    });

    socket.on("pageDeleted", (slug) => {
      setPages((prev) => prev.filter((page) => page.slug !== slug));
      setMessage("Slide deleted in real-time!");
      setMessageType("success");
    });

    socket.on("connect_error", (err) => {
      setMessage("Socket.IO connection error");
      setMessageType("error");
    });

    return () => {
      socket.off("connect");
      socket.off("pageCreated");
      socket.off("pageUpdated");
      socket.off("pageDeleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pages/${id}`);
      setMessage("Page deleted successfully");
      setMessageType("success");
      setDeleteId(null);
    } catch (error) {
      setMessage("Error deleting page");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const renderPageCard = (page) => (
    <Card
      key={page._id}
      gradient={page.gradient}
      header={
        <div>
          <h3 className="text-xl font-bold">{page.titleDesktop}</h3>
          <p className="text-sm">/{page.slug}</p>
        </div>
      }
      actions={
        <>
          <Button
            variant="icon"
            icon={<Edit className="h-5 w-5" />}
            onClick={() => {
              setPageToEdit(page);
              setIsFormOpen(true);
            }}
          />
          <Button
            variant="icon"
            icon={<Trash2 className="h-5 w-5" />}
            onClick={() => setDeleteId(page._id)}
          />
        </>
      }
    >
      <p className="text-sm text-gray-600">Mobile: {page.titleMobile}</p>
      {page.gradientWords.length > 0 && (
        <p className="text-sm text-gray-600">
          Gradient Words: {page.gradientWords.join(", ")}
        </p>
      )}
      {page.benefits.length > 0 && (
        <ul className="mt-2 space-y-1">
          {page.benefits.map((benefit, i) => (
            <li key={i} className="text-sm text-gray-600">
              <strong>{benefit.heading}:</strong> {benefit.description}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Slider Manager</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={async () => {
              try {
                const response = await api.get("/pages");
                setPages(Array.isArray(response.data) ? response.data : []);
              } catch (error) {
                setMessage("Error fetching pages");
                setMessageType("error");
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<PlusCircle className="h-4 w-4" />}
            onClick={() => {
              setPageToEdit(null);
              setIsFormOpen(true);
            }}
          >
            New Slide
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>{pages.map(renderPageCard)}</AnimatePresence>
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion">
        <p className="mb-6">Are you sure you want to delete this slide?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>
            Delete
          </Button>
        </div>
      </Modal>

      <PageForm
        pageToEdit={pageToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setPageToEdit(null);
          const fetchPages = async () => {
            try {
              const response = await api.get("/pages");
              setPages(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
              setMessage("Error fetching pages");
              setMessageType("error");
            }
          };
          fetchPages();
        }}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default SliderManager;