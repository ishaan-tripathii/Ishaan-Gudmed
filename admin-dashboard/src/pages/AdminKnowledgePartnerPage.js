// src/components/AdminKnowledgePartnerPage.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminKnowledgePartnerPage = () => {
  const [settings, setSettings] = useState({
    partners: [],
    accreditations: [],
    twoFactorsImage: "https://example.com/default-two-factors.png", // Default value
    titles: {
      weAre: "We Are !",
      accredited: "Accredited",
      knowledgePartners: "Our Knowledge Partners",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/knowledge-partners");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings({
        ...data,
        titles: {
          weAre: data.titles?.weAre || "We Are !",
          accredited: data.titles?.accredited || "Accredited",
          knowledgePartners: data.titles?.knowledgePartners || "Our Knowledge Partners",
        },
        twoFactorsImage: data.twoFactorsImage || "https://example.com/default-two-factors.png", // Fallback
      });
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch settings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    socket.on("knowledgePartnersUpdated", fetchSettings);
    return () => socket.off("knowledgePartnersUpdated");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      return;
    }
    if (!settings.twoFactorsImage.trim()) {
      setError("Two Factors Image URL is required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/knowledge-partners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings");
      }
      await fetchSettings();
      setError("");
    } catch (err) {
      setError(err.message || "Error updating settings");
    }
  };

  const addItem = (type) => {
    setSettings((prev) => ({
      ...prev,
      [type]: [...prev[type], { title: "", image: "" }],
    }));
  };

  const handleItemChange = (type, index, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleDeleteItem = (type, index) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    setSettings((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const moveItemUp = (type, index) => {
    if (index === 0) return;
    setSettings((prev) => {
      const items = [...prev[type]];
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      return { ...prev, [type]: items };
    });
  };

  const moveItemDown = (type, index) => {
    if (index === settings[type].length - 1) return;
    setSettings((prev) => {
      const items = [...prev[type]];
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      return { ...prev, [type]: items };
    });
  };

  const handleTwoFactorsChange = (value) => {
    setSettings((prev) => ({ ...prev, twoFactorsImage: value }));
  };

  const handleTitleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      titles: { ...prev.titles, [field]: value },
    }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Knowledge Partners</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Section Titles</h2>
            <p className="text-gray-600 mb-4">Customize the titles for each section.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">"We Are" Title</label>
                <input
                  type="text"
                  value={settings.titles.weAre}
                  onChange={(e) => handleTitleChange("weAre", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">"Accredited" Title</label>
                <input
                  type="text"
                  value={settings.titles.accredited}
                  onChange={(e) => handleTitleChange("accredited", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">"Knowledge Partners" Title</label>
                <input
                  type="text"
                  value={settings.titles.knowledgePartners}
                  onChange={(e) => handleTitleChange("knowledgePartners", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Knowledge Partners</h2>
            <p className="text-gray-600 mb-4">Add and arrange knowledge partner logos.</p>
            {settings.partners.map((partner, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:space-x-4"
              >
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    placeholder="Title (e.g., GOOGLE)"
                    value={partner.title}
                    onChange={(e) => handleItemChange("partners", index, "title", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL (e.g., http://example.com/google.png)"
                    value={partner.image}
                    onChange={(e) => handleItemChange("partners", index, "image", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => moveItemUp("partners", index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown("partners", index)}
                    disabled={index === settings.partners.length - 1}
                    className={`p-2 rounded-lg text-white ${index === settings.partners.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem("partners", index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem("partners")}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Knowledge Partner
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Accreditations</h2>
            <p className="text-gray-600 mb-4">Add and arrange accreditation logos.</p>
            {settings.accreditations.map((accreditation, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:space-x-4"
              >
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    placeholder="Title (e.g., NABH)"
                    value={accreditation.title}
                    onChange={(e) => handleItemChange("accreditations", index, "title", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL (e.g., http://example.com/nbha.png)"
                    value={accreditation.image}
                    onChange={(e) => handleItemChange("accreditations", index, "image", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => moveItemUp("accreditations", index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItemDown("accreditations", index)}
                    disabled={index === settings.accreditations.length - 1}
                    className={`p-2 rounded-lg text-white ${index === settings.accreditations.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem("accreditations", index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem("accreditations")}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Accreditation
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Two Factors Image</h2>
            <p className="text-gray-600 mb-4">Set the image for the 'We Are' section.</p>
            <input
              type="text"
              placeholder="Image URL (e.g., http://example.com/two-factors.png)"
              value={settings.twoFactorsImage}
              onChange={(e) => handleTwoFactorsChange(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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

export default AdminKnowledgePartnerPage;