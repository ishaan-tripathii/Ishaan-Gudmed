import axios from "axios";

const environments = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "http://localhost:5000",
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === "true",
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || "https://gudmed-backend.onrender.com",
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "https://gudmed-backend.onrender.com",
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === "true",
  },
  staging: {
    API_URL: process.env.REACT_APP_API_URL || "https://gudmed-backend.onrender.com",
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "https://gudmed-backend.onrender.com",
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === "true",
  },
};

const getCurrentEnvironment = () => {
  return process.env.REACT_APP_ENV || "development";
};

const getEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
};

export const ENDPOINTS = {
  PAGES: {
    LIST: "/api/pages",
    DETAIL: (id) => `/api/pages/${id}`,
    CREATE: "/api/pages",
    UPDATE: (id) => `/api/pages/${id}`,
    DELETE: (id) => `/api/pages/${id}`,
    TECHNOLOGY: "/api/pages/technology",
    AI: "/api/pages/ai",
    WHY_GUDMED: "/api/pages/why-gudmed",
  },
  TECHNOLOGY: {
    LIST: "/api/technology",
    DETAIL: (id) => `/api/technology/${id}`,
    CREATE: "/api/technology",
    UPDATE: (id) => `/api/technology/${id}`,
    DELETE: (id) => `/api/technology/${id}`,
  },
  AI_PAGES: {
    LIST: "/api/ai-pages",
    DETAIL: (id) => `/api/ai-pages/${id}`,
    CREATE: "/api/ai-pages",
    UPDATE: (id) => `/api/ai-pages/${id}`,
    DELETE: (id) => `/api/ai-pages/${id}`,
  },
  WHY_GUDMED: {
    LIST: "/api/why-gudmed",
    DETAIL: (id) => `/api/why-gudmed/${id}`,
    CREATE: "/api/why-gudmed",
    UPDATE: (id) => `/api/why-gudmed/${id}`,
    DELETE: (id) => `/api/why-gudmed/${id}`,
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH_TOKEN: "/api/auth/refresh-token",
  },
  CLIENTS: {
    LIST: "/api/clients",
    SETTINGS: "/api/clients",
    GET_SETTINGS: "/api/clients",
  },
  KNOWLEDGE_PARTNERS: {
    LIST: "/api/knowledge-partners",
    DETAIL: (id) => `/api/knowledge-partners/${id}`,
  },
  COMPARISON: {
    LIST: "/api/comparison",
    DETAIL: (id) => `/api/comparison/${id}`,
  },
  COUNTER: {
    LIST: "/api/counter",
    DETAIL: (id) => `/api/counter/${id}`,
  },
  STEP_BY_STEP: {
    LIST: "/api/step-by-step",
    DETAIL: (id) => `/api/step-by-step/${id}`,
  },
  ANIMATED_TEXT: {
    LIST: "/api/animated-text",
    DETAIL: (id) => `/api/animated-text/${id}`,
  },
  IMAGE_COMPARISON: {
    LIST: "/api/image-comparison",
    DETAIL: (id) => `/api/image-comparison/${id}`,
  },
  FOOTER: {
    LIST: "/api/footer",
    DETAIL: (id) => `/api/footer/${id}`,
  },
};

const envConfig = getEnvironmentConfig();

const API_URL = envConfig.API_URL;
const SOCKET_URL = envConfig.SOCKET_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

if (envConfig.ENABLE_LOGS) {
  api.interceptors.request.use(
    (config) => {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        data: config.data,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log("API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error("API Response Error:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

export const getImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

export const config = {
  API_URL,
  SOCKET_URL,
  getApiUrl: (endpoint) => `${API_URL}${endpoint}`,
  getSocketUrl: () => SOCKET_URL,
};

export default api;