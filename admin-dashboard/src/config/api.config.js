// Environment configurations
const environments = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://api.yourdomain.com',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://api.yourdomain.com',
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true'
  },
  staging: {
    API_URL: process.env.REACT_APP_API_URL || 'https://staging-api.yourdomain.com',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://staging-api.yourdomain.com',
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true'
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  return process.env.REACT_APP_ENV || 'development';
};

// Get environment config
const getEnvironmentConfig = () => {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
};

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // Pages/Slides endpoints
  PAGES: {
    LIST: '/pages',
    DETAIL: (id) => `/pages/${id}`,
    CREATE: '/pages',
    UPDATE: (id) => `/pages/${id}`,
    DELETE: (id) => `/pages/${id}`,
  },

  // Why GudMed Unique Points endpoints
  UNIQUE_POINTS: {
    LIST: '/api/why-gudmed',
    DETAIL: (id) => `/api/why-gudmed/${id}`,
    CREATE: '/api/why-gudmed',
    UPDATE: (id) => `/api/why-gudmed/${id}`,
    DELETE: (id) => `/api/why-gudmed/${id}`,
  },

  // Clients endpoints
  CLIENTS: {
    LIST: '/clients',
    SETTINGS: '/clients',
    GET_SETTINGS: '/clients'
  },

  // Users endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  }
};

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://gudmed-backend.onrender.com';

export const config = {
  API_URL,
  SOCKET_URL,
  getApiUrl: (endpoint) => `${API_URL}${endpoint}`,
  getSocketUrl: () => SOCKET_URL,
}; 