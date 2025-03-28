import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

const config = {
  apiBaseUrl: isProduction ? "https://gudmed-backend.onrender.com/api" : "http://localhost:5000/api",
  socketBaseUrl: isProduction ? "https://gudmed-backend.onrender.com" : "http://localhost:5000",
};

export const getStepByStep = async () => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/step-by-step`);
    return response.data;
  } catch (error) {
    console.error("Error fetching step-by-step data:", error);
    throw error;
  }
};

export const updateStepByStep = async (data, token) => {
  try {
    const response = await axios.put(`${config.apiBaseUrl}/step-by-step`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating step-by-step data:", error);
    throw error;
  }
};

// Add other API functions (e.g., create, delete) as needed