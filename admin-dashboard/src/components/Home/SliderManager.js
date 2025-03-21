import React, { useState, useEffect } from "react";
import { RefreshCw, Edit, Trash2, PlusCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import useSocket from "../../hooks/useSocket";
import useApi from "../../hooks/useApi";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Card from "../common/Card";
import PageForm from "../PageForm";

const SliderManager = () => {
  const [pages, setPages] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { get, delete: deleteRequest } = useApi();

  const { socket } = useSocket({
    contentUpdated: () => {
      fetchPages();
      setMessage("Content updated in real-time");
      setMessageType("success");
    }
  });

  const fetchPages = async () => {
    try {
      const data = await get("/pages");
      setPages(data);
    } catch (error) {
      setMessage("Error fetching pages");
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(`/pages/${id}`);
      setMessage("Page deleted successfully");
      setMessageType("success");
      fetchPages();
      setDeleteId(null);
    } catch (error) {
      setMessage("Error deleting page");
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Slider Manager</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchPages}
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

      <AnimatePresence>
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
          >
            {message}
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {pages.map(renderPageCard)}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
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
          fetchPages();
        }}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default SliderManager;