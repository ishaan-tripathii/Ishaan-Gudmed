// Environment configurations
const environments = {
  development: {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'ws://localhost:5000',
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'wss://gudmed-backend.onrender.com',
    ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true'
  },
  staging: {
    API_URL: process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'wss://gudmed-backend.onrender.com',
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
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    USER: '/api/auth/user'
  },

  // Pages/Slides endpoints
  PAGES: {
    LIST: '/api/pages',
    DETAIL: (id) => `/api/pages/${id}`,
    CREATE: '/api/pages',
    UPDATE: (id) => `/api/pages/${id}`,
    DELETE: (id) => `/api/pages/${id}`
  },

  // Technology endpoints
  TECHNOLOGY: {
    LIST: '/api/technology',
    DETAIL: (id) => `/api/technology/${id}`,
    CREATE: '/api/technology',
    UPDATE: (id) => `/api/technology/${id}`,
    DELETE: (id) => `/api/technology/${id}`
  },

  // AI Page endpoints
  AI_PAGES: {
    LIST: '/api/ai-pages',
    DETAIL: (id) => `/api/ai-pages/${id}`,
    CREATE: '/api/ai-pages',
    UPDATE: (id) => `/api/ai-pages/${id}`,
    DELETE: (id) => `/api/ai-pages/${id}`,
  },

  // Why GudMed endpoints
  WHY_GUDMED: {
    LIST: '/api/why-gudmed',
    DETAIL: (id) => `/api/why-gudmed/${id}`,
    CREATE: '/api/why-gudmed',
    UPDATE: (id) => `/api/why-gudmed/${id}`,
    DELETE: (id) => `/api/why-gudmed/${id}`,
    UNIQUE_POINTS: {
      LIST: '/api/why-gudmed/unique-points',
      CREATE: '/api/why-gudmed/unique-points',
      UPDATE: (id) => `/api/why-gudmed/unique-points/${id}`,
      DELETE: (id) => `/api/why-gudmed/unique-points/${id}`
    }
  },

  // Clients endpoints
  CLIENTS: {
    LIST: '/api/clients',
    SETTINGS: '/api/clients',
    GET_SETTINGS: '/api/clients'
  },

  // Users endpoints
  USERS: {
    LIST: '/api/users',
    DETAIL: (id) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/api/settings',
    UPDATE: '/api/settings'
  }
};

// API Configuration
export const config = {
  API_URL: getEnvironmentConfig().API_URL,
  SOCKET_URL: getEnvironmentConfig().SOCKET_URL,
  getApiUrl: (endpoint) => `${getEnvironmentConfig().API_URL}${endpoint}`,
  getSocketUrl: () => getEnvironmentConfig().SOCKET_URL,
}; 