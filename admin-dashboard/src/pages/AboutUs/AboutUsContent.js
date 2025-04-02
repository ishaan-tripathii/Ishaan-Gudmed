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

import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API_URL = "http://localhost:5000/api/aboutus";

const AboutUsContent = () => {
  const [formData, setFormData] = useState({ heading: "", subheading: "", description: "", imageUrl: "" });
  const [aboutUs, setAboutUs] = useState(null);

  // Fetch initial About Us data when the component is mounted
  useEffect(() => {
    fetchAboutUs();
    socket.on("aboutUsUpdated", (data) => {
      setAboutUs(data);
      setFormData(data || { heading: "", subheading: "", description: "", imageUrl: "" });
    });
    return () => socket.off("aboutUsUpdated");
  }, []);

  // Fetch About Us data from the server
  const fetchAboutUs = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setAboutUs(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    }
  };

  // Handle input field changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Create operation
  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        alert("Successfully created About Us content");
        fetchAboutUs(); // Refresh data
      } else {
        alert("Failed to create About Us content: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating About Us content:", error);
    }
  };

  // Handle Update operation
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!aboutUs) return alert("No data to update");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(`${API_URL}/${aboutUs._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        alert("Successfully updated About Us content");
        fetchAboutUs(); // Refresh data
      } else {
        alert("Failed to update About Us content: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating About Us content:", error);
    }
  };

  // Handle Delete operation
  const handleDelete = async () => {
    if (!aboutUs) return alert("No data to delete");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`${API_URL}/${aboutUs._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        alert("Successfully deleted About Us content");
        setAboutUs(null); // Clear data
        setFormData({ heading: "", subheading: "", description: "", imageUrl: "" }); // Clear form
      }
    } catch (error) {
      console.error("Error deleting About Us content:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage About Us</h1>
      <form
        onSubmit={aboutUs ? handleUpdate : handleCreate} // Call the correct handler based on whether we're editing or creating
        className="bg-white p-6 shadow-md rounded-lg"
      >
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {aboutUs ? "Update" : "Create"} About Us
          </button>
          {aboutUs && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
