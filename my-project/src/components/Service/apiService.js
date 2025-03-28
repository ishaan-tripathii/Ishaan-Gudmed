// apiService.js
import axios from "axios";

// Use environment variable for the API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getStepByStep = async () => {
  try {
    const response = await axios.get(`${API_URL}/step-by-step`);
    return response.data;
  } catch (error) {
    console.error("Error fetching step-by-step data:", error);
    throw error;
  }
};

export const updateStepByStep = async (data, token) => {
  try {
    const response = await axios.put(`${API_URL}/step-by-step`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating step-by-step data:", error);
    throw error;
  }
};

// Add other API functions (e.g., create, delete) as needed