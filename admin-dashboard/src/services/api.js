import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Since useAuth is a hook, we can't use it directly here.
// Instead, we'll set up an interceptor to dynamically fetch the token.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
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