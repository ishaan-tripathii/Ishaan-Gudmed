

// src/components/AdminCounterPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminCounterPage = () => {
  const [counter, setCounter] = useState({
    title: "Our Impact",
    items: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchCounter = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/counter");
      setCounter({
        title: response.data.title || "Our Impact",
        items: response.data.items || [],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch counter data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounter();
    socket.on("counterUpdated", fetchCounter);
    return () => socket.off("counterUpdated");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      return;
    }
    try {
      await axios.put(
        "http://localhost:5000/api/counter",
        counter,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCounter();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating counter data");
    }
  };

  const addItem = () => {
    setCounter((prev) => ({
      ...prev,
      items: [...prev.items, { label: "", number: 0, icon: "" }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    setCounter((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: field === "number" ? Number(value) : value } : item
      ),
    }));
  };

  const handleDeleteItem = (index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setCounter((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItemUp = (index) => {
    if (index === 0) return;
    setCounter((prev) => {
      const items = [...prev.items];
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      return { ...prev, items };
    });
  };

  const moveItemDown = (index) => {
    if (index === counter.items.length - 1) return;
    setCounter((prev) => {
      const items = [...prev.items];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      return { ...prev, items };
    });
  };

  const handleTitleChange = (value) => {
    setCounter((prev) => ({ ...prev, title: value }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Counter Section</h1>
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Section Title</h2>
            <input
              type="text"
              value={counter.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Our Impact"
              required
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Counter Items</h2>
            {counter.items.map((item, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
              >
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleItemChange(index, "label", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Label (e.g., Prescriptions Served)"
                  required
                />
                <input
                  type="number"
                  value={item.number}
                  onChange={(e) => handleItemChange(index, "number", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number (e.g., 2650627)"
                  required
                />
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => handleItemChange(index, "icon", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Icon URL (e.g., https://example.com/icon.png)"
                  required
                />
                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => moveItemUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown(index)}
                    disabled={index === counter.items.length - 1}
                    className={`p-2 rounded-lg text-white ${index === counter.items.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Counter Item
            </button>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCounterPage;