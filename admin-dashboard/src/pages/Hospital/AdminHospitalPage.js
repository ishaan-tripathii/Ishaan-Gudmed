import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import config from "../../config/config";

const AdminHospitalPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    imageSrc: "",
    features: "",
  });
  const [hospitalData, setHospitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch hospital data
  const fetchHospitalData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/hospital`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setHospitalData(response.data.data || []);
      } else {
        setHospitalData([]);
        toast.error("No hospital data found");
      }
    } catch (error) {
      toast.error("Failed to fetch hospital data: " + (error.response?.data?.message || error.message));
      setHospitalData([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Socket.IO setup
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

    socket.on("connect", () => console.log("Admin connected to socket:", socket.id));
    socket.on("hospital_create", (data) => {
      console.log("Socket create received:", data);
      setHospitalData((prev) => [...prev, data]);
      toast.success("Hospital created in real-time!");
    });
    socket.on("hospital_update", (data) => {
      console.log("Socket update received:", data);
      setHospitalData((prev) => prev.map((item) => (item._id === data._id ? data : item)));
      toast.success("Hospital updated in real-time!");
    });
    socket.on("hospital_delete", (data) => {
      console.log("Socket delete received:", data);
      setHospitalData((prev) => prev.filter((item) => item._id !== data.id));
      toast.success("Hospital deleted in real-time!");
    });
    socket.on("disconnect", () => console.log("Admin disconnected from socket"));

    fetchHospitalData();

    return () => socket.disconnect();
  }, [fetchHospitalData]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ _id: "", title: "", description: "", imageSrc: "", features: "" });
  };

  // Create hospital content
  const handleCreate = async (e) => {
    // Stop the page from refreshing when the form is submitted
    e.preventDefault();
  
    // Show loading spinner or disable button
    setIsLoading(true);
  
    try {
      // Split the features string by comma and remove extra spaces
      // Example: "WiFi, Ambulance" → ["WiFi", "Ambulance"]
      const featuresArray = formData.features
        .split(",")           // break at commas
        .map((f) => f.trim()); // remove extra spaces like " Ambulance" → "Ambulance"
  
      // Create an object with the form data
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        imageSrc: formData.imageSrc,
        features: featuresArray, // send the clean array
      };
  
      console.log("Sending this to server:", dataToSend); // Just to check in console
  
      // Send the data to the backend using POST request
      const response = await axios.post(`${config.apiBaseUrl}/api/hospital`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // send login token for security
        },
      });
  
      // If everything goes well and we get success = true
      if (response.data.success) {
        toast.success("Hospital added successfully ✅");
        resetForm(); // clear the form
      }
  
    } catch (error) {
      // If something goes wrong, show an error message
      toast.error("Something went wrong ❌: " + (error.response?.data?.message || error.message));
    } finally {
      // Whether success or error — stop the loading spinner
      setIsLoading(false);
    }
  };
  

  // Update hospital content
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData._id) {
      toast.error("No hospital selected for update. Please select an entry to edit.");
      return;
    }
    setIsLoading(true);
    try {
      const featuresArray = formData.features.split(",").map((f) => f.trim());
      const dataToSend = { title: formData.title, description: formData.description, imageSrc: formData.imageSrc, features: featuresArray };
      console.log("Updating with:", formData._id, dataToSend); // Debug log
      const response = await axios.put(
        `${config.apiBaseUrl}/api/hospital/${formData._id}`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Hospital content updated successfully");
        resetForm();
      }
    } catch (error) {
      toast.error("Error updating hospital content: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Delete hospital content
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital content?")) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/api/hospital/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Hospital content deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting hospital content: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Populate form for editing
  const handleEdit = (hospital) => {
    console.log("Editing hospital:", hospital); // Debug log
    setFormData({
      _id: hospital._id,
      title: hospital.title,
      description: hospital.description,
      imageSrc: hospital.imageSrc || "",
      features: hospital.features.join(", "),
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <h1 className="text-3xl font-bold mb-4">Manage Hospital Data</h1>

      {/* Form for Create/Update */}
      <form
        onSubmit={(e) => {
          console.log("Form submitted with _id:", formData._id); // Debug log
          formData._id ? handleUpdate(e) : handleCreate(e);
        }}
        className="bg-white p-6 shadow-md rounded-lg mb-6"
      >
        {["title", "description", "imageSrc", "features"].map((field) => (
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
                required={field !== "features" && field !== "imageSrc"}
                placeholder={field === "features" ? "e.g., Feature 1, Feature 2" : ""}
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
            {isLoading ? "Processing..." : formData._id ? "Update" : "Create"} Hospital
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Reset Form
          </button>
        </div>
      </form>

      {/* Hospital Data List */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Hospital Entries</h2>
          {hospitalData.length > 0 ? (
            <ul className="space-y-4">
              {hospitalData.map((hospital) => (
                <li key={hospital._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{hospital.title}</p>
                    <p className="text-gray-600 text-sm">{hospital.description}</p>
                    {hospital.imageSrc && (
                      <img
                        src={hospital.imageSrc}
                        alt={hospital.title}
                        className="w-20 h-20 mt-2"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                      />
                    )}
                    <ul className="list-disc ml-5 text-sm">
                      {hospital.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(hospital)}
                      className="text-blue-500 mr-4 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hospital._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No hospital data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHospitalPage;