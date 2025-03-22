import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Since useAuth is a hook, we can't use it directly here.
// Instead, we'll set up an interceptor to dynamically fetch the token.
const API_URL = process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fallback to localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;