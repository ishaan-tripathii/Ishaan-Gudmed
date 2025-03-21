import axios from 'axios';
import config, { ENDPOINTS } from '../../config/api.config';

// Create axios instance with default config
const apiInstance = axios.create({
    timeout: 30000,
    headers: config.getHeaders()
});

// Request interceptor
apiInstance.interceptors.request.use(
    (reqConfig) => {
        // Update headers before each request
        reqConfig.headers = {
            ...reqConfig.headers,
            ...config.getHeaders()
        };
        return reqConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden access
                    console.error('Access forbidden:', data.message);
                    break;
                case 404:
                    // Handle not found
                    console.error('Resource not found:', data.message);
                    break;
                case 500:
                    // Handle server error
                    console.error('Server error:', data.message);
                    break;
                default:
                    console.error('API Error:', data.message);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', error.request);
        } else {
            // Error in request configuration
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API Service methods
const apiService = {
    // Generic request methods
    get: async (endpoint, params = {}) => {
        const url = config.getApiUrl(endpoint);
        return apiInstance.get(url, { params });
    },

    post: async (endpoint, data = {}) => {
        const url = config.getApiUrl(endpoint);
        return apiInstance.post(url, data);
    },

    put: async (endpoint, data = {}) => {
        const url = config.getApiUrl(endpoint);
        return apiInstance.put(url, data);
    },

    delete: async (endpoint) => {
        const url = config.getApiUrl(endpoint);
        return apiInstance.delete(url);
    },

    // Auth methods
    auth: {
        login: (credentials) => apiService.post(ENDPOINTS.AUTH.LOGIN, credentials),
        register: (userData) => apiService.post(ENDPOINTS.AUTH.REGISTER, userData),
        logout: () => apiService.post(ENDPOINTS.AUTH.LOGOUT),
        refreshToken: () => apiService.post(ENDPOINTS.AUTH.REFRESH_TOKEN)
    },

    // Clients methods
    clients: {
        getAll: () => apiService.get(ENDPOINTS.CLIENTS.LIST),
        getById: (id) => apiService.get(ENDPOINTS.CLIENTS.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.CLIENTS.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.CLIENTS.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.CLIENTS.DELETE(id)),
        updateSettings: (data) => apiService.put(ENDPOINTS.CLIENTS.SETTINGS, data),
        getSettings: () => apiService.get(ENDPOINTS.CLIENTS.GET_SETTINGS)
    },

    // Pages methods
    pages: {
        getAll: () => apiService.get(ENDPOINTS.PAGES.LIST),
        getById: (id) => apiService.get(ENDPOINTS.PAGES.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.PAGES.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.PAGES.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.PAGES.DELETE(id))
    },

    // Users methods
    users: {
        getAll: () => apiService.get(ENDPOINTS.USERS.LIST),
        getById: (id) => apiService.get(ENDPOINTS.USERS.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.USERS.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.USERS.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.USERS.DELETE(id))
    },

    // Settings methods
    settings: {
        get: () => apiService.get(ENDPOINTS.SETTINGS.GET),
        update: (data) => apiService.put(ENDPOINTS.SETTINGS.UPDATE, data)
    }
};

export default apiService; 