import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config";

const AdminMedPage = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    _id: "",
    heading: "",
    description: "",
    image: "",
    features: [
      {
        icon: "",
        content: ""
      }
    ]
  });

  const [mrdData, setMrdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch MRD Data
  const fetchMrdData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/mrd`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMrdData(response.data.data || []);
      } else {
        setMrdData([]);
        toast.error("No MRD data found");
      }
    } catch (error) {
      toast.error("Failed to fetch MRD data: " + (error.response?.data?.message || error.message));
      setMrdData([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Socket.IO setup + initial fetch
  useEffect(() => {
    const socket = io(config.socketBaseUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Admin connected to socket:", socket.id);
    });

    socket.on("mrd_create", (data) => {
      setMrdData((prev) => [...prev, data]);
      toast.success("MRD created in real-time!");
    });

    socket.on("mrd_update", (data) => {
      setMrdData((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
      toast.success("MRD updated in real-time!");
    });

    socket.on("mrd_delete", (data) => {
      setMrdData((prev) => prev.filter((item) => item._id !== data.id));
      toast.success("MRD deleted in real-time!");
    });

    socket.on("disconnect", () => {
      console.log("Admin disconnected from socket");
    });

    fetchMrdData();

    return () => socket.disconnect();
  }, [fetchMrdData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, key, value) => {
    const updated = [...formData.features];
    updated[index][key] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { icon: "", content: "" }],
    }));
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      heading: "",
      description: "",
      image: "",
      features: [{ icon: "", content: "" }],
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSend = {
        heading: formData.heading,
        description: formData.description,
        image: formData.image,
        features: formData.features,
      };

      const response = await axios.post(`${config.apiBaseUrl}/api/mrd`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("MRD data added successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData._id) {
      toast.error("No MRD selected for update");
      return;
    }
    setIsLoading(true);
    try {
      const updatedData = {
        heading: formData.heading,
        description: formData.description,
        image: formData.image,
        features: formData.features,
      };

      const response = await axios.put(
        `${config.apiBaseUrl}/api/mrd/${formData._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("MRD data updated successfully");
        resetForm();
        fetchMrdData();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Hi, welcome to the MRD page</h1>

      <form onSubmit={formData._id ? handleUpdate : handleCreate} className="space-y-4">
        <input
          type="text"
          name="heading"
          placeholder="Heading"
          value={formData.heading}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div>
          <p className="font-semibold mb-2">Features:</p>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Icon"
                value={feature.icon}
                onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
                className="border p-2 rounded w-1/4"
              />
              <input
                type="text"
                placeholder="Content"
                value={feature.content}
                onChange={(e) => handleFeatureChange(index, "content", e.target.value)}
                className="border p-2 rounded w-2/4"
              />
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddFeature}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Feature
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
          disabled={isLoading}
        >
          {formData._id ? "Update MRD" : "Create MRD"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-2">All MRD Entries:</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading MRD data...</p>
        ) : (
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(mrdData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default AdminMedPage;
