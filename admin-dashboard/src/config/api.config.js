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
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    USER: '/auth/user'
  },

  // Pages/Slides endpoints
  PAGES: {
    LIST: '/pages',
    DETAIL: (id) => `/pages/${id}`,
    CREATE: '/pages',
    UPDATE: (id) => `/pages/${id}`,
    DELETE: (id) => `/pages/${id}`
  },

  // Technology endpoints
  TECHNOLOGY: {
    LIST: '/technology',
    DETAIL: (id) => `/technology/${id}`,
    CREATE: '/technology',
    UPDATE: (id) => `/technology/${id}`,
    DELETE: (id) => `/technology/${id}`
  },

  // AI Page endpoints
  AI_PAGES: {
    LIST: '/ai-pages',
    DETAIL: (id) => `/ai-pages/${id}`,
    CREATE: '/ai-pages',
    UPDATE: (id) => `/ai-pages/${id}`,
    DELETE: (id) => `/ai-pages/${id}`,
  },

  // Why GudMed endpoints
  WHY_GUDMED: {
    LIST: '/why-gudmed',
    DETAIL: (id) => `/why-gudmed/${id}`,
    CREATE: '/why-gudmed',
    UPDATE: (id) => `/why-gudmed/${id}`,
    DELETE: (id) => `/why-gudmed/${id}`,
    UNIQUE_POINTS: {
      LIST: '/why-gudmed/unique-points',
      CREATE: '/why-gudmed/unique-points',
      UPDATE: (id) => `/why-gudmed/unique-points/${id}`,
      DELETE: (id) => `/why-gudmed/unique-points/${id}`
    }
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
    DELETE: (id) => `/users/${id}`
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings'
  }
};

// API Configuration
export const config = {
  API_URL: getEnvironmentConfig().API_URL,
  SOCKET_URL: getEnvironmentConfig().SOCKET_URL,
  getApiUrl: (endpoint) => {
    const baseUrl = getEnvironmentConfig().API_URL;
    // Remove trailing /api if it exists
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    return `${cleanBaseUrl}/api${endpoint}`;
  },
  getSocketUrl: () => getEnvironmentConfig().SOCKET_URL,
}; 