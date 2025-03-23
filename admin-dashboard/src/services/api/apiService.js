import axios from 'axios';
import { config, ENDPOINTS } from '../../config/api.config';

// Create axios instance with default config
const apiInstance = axios.create({
    baseURL: config.API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log('API Request:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data,
                fullUrl: `${config.baseURL}${config.url}`
            });
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiInstance.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log('API Response:', {
                url: response.config.url,
                status: response.status,
                data: response.data
            });
        }
        return response;
    },
    async (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            // Log error in development
            if (process.env.NODE_ENV === 'development') {
                console.error('API Error:', {
                    url: error.config?.url,
                    status,
                    data,
                    fullUrl: `${config.API_URL}${error.config?.url}`
                });
            }

            switch (status) {
                case 401:
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
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
        return apiInstance.get(endpoint, { params });
    },

    post: async (endpoint, data = {}) => {
        return apiInstance.post(endpoint, data);
    },

    put: async (endpoint, data = {}) => {
        return apiInstance.put(endpoint, data);
    },

    delete: async (endpoint) => {
        return apiInstance.delete(endpoint);
    },

    // Auth methods
    auth: {
        login: async (credentials) => {
            try {
                const response = await apiInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                return response.data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        register: (userData) => apiService.post(ENDPOINTS.AUTH.REGISTER, userData),
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return apiService.post(ENDPOINTS.AUTH.LOGOUT);
        },
        getUser: () => apiService.get(ENDPOINTS.AUTH.USER),
        refreshToken: () => apiService.post(ENDPOINTS.AUTH.REFRESH_TOKEN)
    },

    // Pages methods
    pages: {
        getAll: () => apiService.get(ENDPOINTS.PAGES.LIST),
        getById: (id) => apiService.get(ENDPOINTS.PAGES.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.PAGES.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.PAGES.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.PAGES.DELETE(id))
    },

    // Technology methods
    technology: {
        getAll: () => apiService.get(ENDPOINTS.TECHNOLOGY.LIST),
        getById: (id) => apiService.get(ENDPOINTS.TECHNOLOGY.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.TECHNOLOGY.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.TECHNOLOGY.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.TECHNOLOGY.DELETE(id))
    },

    // Why GudMed methods
    whyGudMed: {
        getAll: () => apiService.get(ENDPOINTS.WHY_GUDMED.LIST),
        getById: (id) => apiService.get(ENDPOINTS.WHY_GUDMED.DETAIL(id)),
        create: (data) => apiService.post(ENDPOINTS.WHY_GUDMED.CREATE, data),
        update: (id, data) => apiService.put(ENDPOINTS.WHY_GUDMED.UPDATE(id), data),
        delete: (id) => apiService.delete(ENDPOINTS.WHY_GUDMED.DELETE(id)),
        getUniquePoints: () => apiService.get(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.LIST),
        createUniquePoint: (data) => apiService.post(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.CREATE, data),
        updateUniquePoint: (id, data) => apiService.put(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.UPDATE(id), data),
        deleteUniquePoint: (id) => apiService.delete(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.DELETE(id))
    }
};

export default apiService;