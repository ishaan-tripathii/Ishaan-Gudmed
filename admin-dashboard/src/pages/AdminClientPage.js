import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000", { reconnection: true });

const AdminClientPage = () => {
  const [settings, setSettings] = useState({
    clients: [],
    swiperSettings: {
      slidesPerView: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
      slidesPerGroup: { default: 4, breakpoints: { 1200: 4, 1024: 3, 768: 3, 480: 2, 320: 2 } },
    },
  });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchSettings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/clients");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch client settings");
      toast.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchSettings();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server, socket ID:", socket.id);
    });

    socket.on("clientSettingsUpdated", (eventData) => {
      console.log("Frontend: Received clientSettingsUpdated event:", eventData);
      // Extract the data field from the event payload
      const updatedSettings = eventData?.data;
      // Ensure the data structure matches what the state expects
      if (updatedSettings && updatedSettings.clients && updatedSettings.swiperSettings) {
        setSettings(updatedSettings);
        toast.success("Settings updated in real-time!");
      } else {
        console.error("Frontend: Invalid data structure received:", eventData);
        toast.warn("Received invalid settings data, refetching...");
        fetchSettings(); // Fallback to refetch if the data is invalid
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Frontend: Socket.IO connection error:", err.message);
      toast.error("Failed to connect to server: " + err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Frontend: Socket.IO disconnected:", reason);
      toast.warn("Disconnected from server");
    });

    return () => {
      socket.off("clientSettingsUpdated");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to perform this action.");
      toast.error("Please log in to update settings");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      const updatedData = await response.json();
      setSettings(updatedData.data);
      setError("");
      toast.success("Settings updated successfully!");
    } catch (err) {
      setError(err.message || "Error updating settings");
      toast.error(err.message || "Error updating settings");
    }
  };

  const addClient = () => {
    setSettings({
      ...settings,
      clients: [...settings.clients, { src: "", alt: "" }],
    });
  };

  const handleClientChange = (index, field, value) => {
    const updatedClients = settings.clients.map((client, i) =>
      i === index ? { ...client, [field]: value } : client
    );
    setSettings({ ...settings, clients: updatedClients });
  };

  const handleDeleteClient = (index) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    const updatedClients = settings.clients.filter((_, i) => i !== index);
    setSettings({ ...settings, clients: updatedClients });
  };

  const moveClientUp = (index) => {
    if (index === 0) return;
    const updatedClients = [...settings.clients];
    [updatedClients[index - 1], updatedClients[index]] = [updatedClients[index], updatedClients[index - 1]];
    setSettings({ ...settings, clients: updatedClients });
  };

  const moveClientToFirst = (index) => {
    if (index === 0) return;
    const updatedClients = [...settings.clients];
    const [clientToMove] = updatedClients.splice(index, 1);
    updatedClients.unshift(clientToMove);
    setSettings({ ...settings, clients: updatedClients });
  };

  const moveClientDown = (index) => {
    if (index === settings.clients.length - 1) return;
    const updatedClients = [...settings.clients];
    [updatedClients[index], updatedClients[index + 1]] = [updatedClients[index + 1], updatedClients[index]];
    setSettings({ ...settings, clients: updatedClients });
  };

  const handleSwiperChange = (type, breakpoint, value) => {
    const updatedSettings = { ...settings.swiperSettings };
    if (breakpoint === "default") {
      updatedSettings[type].default = parseInt(value) || 1;
    } else {
      updatedSettings[type].breakpoints[breakpoint] = parseInt(value) || 1;
    }
    setSettings({ ...settings, swiperSettings: updatedSettings });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Our Clients</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Clients Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Client Logos</h2>
            <p className="text-gray-600 mb-4">Add and arrange client logos to display in the carousel.</p>
            {settings.clients.map((client, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4"
              >
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    placeholder="Image URL (e.g., http://example.com/logo.png)"
                    value={client.src}
                    onChange={(e) => handleClientChange(index, "src", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Alt Text (e.g., Client Name)"
                    value={client.alt}
                    onChange={(e) => handleClientChange(index, "alt", e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => moveClientUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${
                      index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveClientDown(index)}
                    disabled={index === settings.clients.length - 1}
                    className={`p-2 rounded-lg text-white ${
                      index === settings.clients.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => moveClientToFirst(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-lg text-white ${
                      index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Top
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClient(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addClient}
              className="w-full sm:w-auto mt-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add New Client
            </button>
          </div>

          {/* Swiper Settings Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Carousel Settings</h2>
            <p className="text-gray-600 mb-4">
              Adjust how many logos are shown and move at a time on different screen sizes.
            </p>
            {["slidesPerView", "slidesPerGroup"].map((type) => (
              <div key={type} className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 capitalize">
                  {type.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Default</label>
                    <input
                      type="number"
                      value={settings.swiperSettings[type].default}
                      onChange={(e) => handleSwiperChange(type, "default", e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                  {Object.keys(settings.swiperSettings[type].breakpoints).map((breakpoint) => (
                    <div key={breakpoint}>
                      <label className="block text-sm text-gray-600 mb-1">{`@${breakpoint}px`}</label>
                      <input
                        type="number"
                        value={settings.swiperSettings[type].breakpoints[breakpoint]}
                        onChange={(e) => handleSwiperChange(type, breakpoint, e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
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

export default AdminClientPage;