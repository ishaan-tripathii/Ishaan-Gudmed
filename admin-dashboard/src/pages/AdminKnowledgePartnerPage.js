import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config/config"; // Import the configuration file

const AdminKnowledgePartner = () => {
  const [data, setData] = useState({
    partners: [],
    accreditations: [],
    twoFactorsImage: "",
    titles: { weAre: "We Are !", accredited: "Accredited", knowledgePartners: "Our Knowledge Partners" },
  });
  const [loading, setLoading] = useState(true);

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

    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/knowledge-partners`);
        setData(response.data || data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Knowledge Partners:", error);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("connect", () => {
      console.log("AdminKnowledgePartner Socket.IO connected:", socket.id);
    });

    socket.on("knowledgePartners_created", (newData) => {
      console.log("Received knowledgePartners_created:", newData);
      setData(newData);
      toast.success("Knowledge Partners created!");
    });

    socket.on("knowledgePartners_updated", (updatedData) => {
      console.log("Received knowledgePartners_updated:", updatedData);
      setData(updatedData);
      toast.success("Knowledge Partners updated!");
    });

    socket.on("knowledgePartners_deleted", (deletedData) => {
      console.log("Received knowledgePartners_deleted:", deletedData);
      if (data._id === deletedData._id) {
        setData({
          partners: [],
          accreditations: [],
          twoFactorsImage: "",
          titles: { weAre: "We Are !", accredited: "Accredited", knowledgePartners: "Our Knowledge Partners" },
        });
        toast.info("Knowledge Partners deleted!");
      }
    });

    socket.on("connect_error", (err) => {
      console.error("AdminKnowledgePartner Socket.IO connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("knowledgePartners_created");
      socket.off("knowledgePartners_updated");
      socket.off("knowledgePartners_deleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [data._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data._id) {
        await axios.put(`${config.apiBaseUrl}/api/knowledge-partners/${data._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${config.apiBaseUrl}/api/knowledge-partners`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      toast.success("Knowledge Partners saved successfully!");
    } catch (error) {
      console.error("Error saving Knowledge Partners:", error);
      toast.error("Failed to save Knowledge Partners!");
    }
  };

  const handleDelete = async () => {
    if (!data._id || !window.confirm("Are you sure you want to delete this data?")) return;
    try {
      await axios.delete(`${config.apiBaseUrl}/api/knowledge-partners/${data._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Knowledge Partners deleted successfully!");
    } catch (error) {
      console.error("Error deleting Knowledge Partners:", error);
      toast.error("Failed to delete Knowledge Partners!");
    }
  };

  const addPartner = () => {
    setData((prev) => ({
      ...prev,
      partners: [...prev.partners, { title: "", image: "" }],
    }));
  };

  const updatePartner = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      partners: prev.partners.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const addAccreditation = () => {
    setData((prev) => ({
      ...prev,
      accreditations: [...prev.accreditations, { title: "", image: "" }],
    }));
  };

  const updateAccreditation = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      accreditations: prev.accreditations.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Knowledge Partners</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold">Two Factors Image URL</label>
          <input
            type="text"
            value={data.twoFactorsImage}
            onChange={(e) => setData((prev) => ({ ...prev, twoFactorsImage: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Titles</h2>
          <input
            type="text"
            value={data.titles.weAre}
            onChange={(e) => setData((prev) => ({ ...prev, titles: { ...prev.titles, weAre: e.target.value } }))}
            className="w-full p-2 border rounded mt-2"
            placeholder="We Are Title"
          />
          <input
            type="text"
            value={data.titles.accredited}
            onChange={(e) => setData((prev) => ({ ...prev, titles: { ...prev.titles, accredited: e.target.value } }))}
            className="w-full p-2 border rounded mt-2"
            placeholder="Accredited Title"
          />
          <input
            type="text"
            value={data.titles.knowledgePartners}
            onChange={(e) =>
              setData((prev) => ({ ...prev, titles: { ...prev.titles, knowledgePartners: e.target.value } }))
            }
            className="w-full p-2 border rounded mt-2"
            placeholder="Knowledge Partners Title"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Partners</h2>
          {data.partners.map((partner, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input
                type="text"
                value={partner.title}
                onChange={(e) => updatePartner(index, "title", e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="Partner Title"
              />
              <input
                type="text"
                value={partner.image}
                onChange={(e) => updatePartner(index, "image", e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="Image URL"
              />
            </div>
          ))}
          <button type="button" onClick={addPartner} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Add Partner
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Accreditations</h2>
          {data.accreditations.map((accreditation, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input
                type="text"
                value={accreditation.title}
                onChange={(e) => updateAccreditation(index, "title", e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="Accreditation Title"
              />
              <input
                type="text"
                value={accreditation.image}
                onChange={(e) => updateAccreditation(index, "image", e.target.value)}
                className="w-1/2 p-2 border rounded"
                placeholder="Image URL"
              />
            </div>
          ))}
          <button type="button" onClick={addAccreditation} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Add Accreditation
          </button>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {data._id ? "Update" : "Create"} Knowledge Partners
          </button>
          {data._id && (
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminKnowledgePartner;