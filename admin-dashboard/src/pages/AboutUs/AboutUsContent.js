// import React, { useState, useEffect } from 'react';

// const AboutUsContent = () => {
//   const [aboutUs, setAboutUs] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch data from the API
//   useEffect(() => {
//     fetchAboutUs();
//   }, []);

//   const fetchAboutUs = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/aboutus/');
//       const result = await response.json();
//       if (result.success) {
//         setAboutUs(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching About Us data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       {aboutUs ? (
//         <div className="bg-white shadow-lg rounded-lg p-6">
//           <h1 className="text-2xl font-bold text-gray-800">{aboutUs.heading}</h1>
//           <h2 className="text-xl text-gray-600">{aboutUs.subheading}</h2>
//           <p className="text-gray-700 mt-2">{aboutUs.description}</p>
//           <img src={aboutUs.imageUrl} alt="About Us" className="mt-4 rounded-lg shadow-md" />
//         </div>
//       ) : (
//         <p>No content available.</p>
//       )}
//     </div>
//   );
// };

// export default AboutUsContent;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config"; // Verify this path matches your project structure

const AboutUsContent = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    description: "",
    imageUrl: "",
  });
  const [aboutUs, setAboutUs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch About Us data from the API, memoized with useCallback
  const fetchAboutUs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/aboutus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAboutUs(response.data.data);
        setFormData(response.data.data);
      } else {
        setAboutUs(null);
        setFormData({ heading: "", subheading: "", description: "", imageUrl: "" });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAboutUs(null);
        setFormData({ heading: "", subheading: "", description: "", imageUrl: "" });
      } else {
        toast.error("Failed to fetch About Us data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Dependency: token

  // Initialize Socket.IO and fetch data on mount or token change
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
      // Optional: console.log("Socket connected");
    });

    socket.on("aboutUsCreated", (data) => {
      setAboutUs(data);
      setFormData(data);
      toast.success("About Us content created in real-time!");
    });

    socket.on("aboutUsUpdated", (data) => {
      setAboutUs(data);
      setFormData(data);
      toast.success("About Us content updated in real-time!");
    });

    socket.on("aboutUsDeleted", () => {
      setAboutUs(null);
      setFormData({ heading: "", subheading: "", description: "", imageUrl: "" });
      toast.success("About Us content deleted in real-time!");
    });

    socket.on("connect_error", (error) => {
      // Optional: console.error("Socket connection error:", error);
    });

    fetchAboutUs();

    // Cleanup socket listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("aboutUsCreated");
      socket.off("aboutUsUpdated");
      socket.off("aboutUsDeleted");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [token, fetchAboutUs]); // Dependencies: token, fetchAboutUs

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle creating new About Us content
  const handleCreate = async (e) => {
    e.preventDefault();
    if (aboutUs) {
      toast.error("About Us content already exists. Use update instead.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/aboutus`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Successfully created About Us content");
        fetchAboutUs();
      } else {
        toast.error("Failed to create About Us content: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error creating About Us content: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating existing About Us content
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!aboutUs) {
      toast.error("No About Us content to update. Create first.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(`${config.apiBaseUrl}/api/aboutus/${aboutUs._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Successfully updated About Us content");
        fetchAboutUs();
      } else {
        toast.error("Failed to update About Us content: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error updating About Us content: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting About Us content
  const handleDelete = async () => {
    if (!aboutUs) {
      toast.error("No About Us content to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the About Us content?")) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/api/aboutus/${aboutUs._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Successfully deleted About Us content");
        fetchAboutUs();
      } else {
        toast.error("Failed to delete About Us content: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting About Us content: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <h1 className="text-3xl font-bold mb-4">Manage About Us</h1>
      <form onSubmit={aboutUs ? handleUpdate : handleCreate} className="bg-white p-6 shadow-md rounded-lg">
        {["heading", "subheading", "description", "imageUrl"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block font-medium capitalize">{field}:</label>
            {field === "description" ? (
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            ) : (
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            )}
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : aboutUs ? "Update" : "Create"} About Us
          </button>
          {aboutUs && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AboutUsContent;