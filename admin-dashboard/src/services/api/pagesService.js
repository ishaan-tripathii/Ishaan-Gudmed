import apiService from './apiService';
import { ENDPOINTS } from '../../config/api.config';

const pagesService = {
    // Get all pages
    getAllPages: async () => {
        try {
            const response = await apiService.get(ENDPOINTS.PAGES.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching pages:', error);
            throw error;
        }
    },

    // Get unique points
    getUniquePoints: async () => {
        try {
            const response = await apiService.get(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching unique points:', error);
            throw error;
        }
    },

    // Get page by ID
    getPageById: async (id) => {
        try {
            const response = await apiService.get(ENDPOINTS.PAGES.DETAIL(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching page:', error);
            throw error;
        }
    },

    // Create new page
    createPage: async (pageData) => {
        try {
            const response = await apiService.post(ENDPOINTS.PAGES.CREATE, pageData);
            return response.data;
        } catch (error) {
            console.error('Error creating page:', error);
            throw error;
        }
    },

    // Update page
    updatePage: async (id, pageData) => {
        try {
            const response = await apiService.put(ENDPOINTS.PAGES.UPDATE(id), pageData);
            return response.data;
        } catch (error) {
            console.error('Error updating page:', error);
            throw error;
        }
    },

    // Delete page
    deletePage: async (id) => {
        try {
            const response = await apiService.delete(ENDPOINTS.PAGES.DELETE(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting page:', error);
            throw error;
        }
    },

    // Technology methods
    getTechnologyList: async () => {
        try {
            const response = await apiService.get(ENDPOINTS.TECHNOLOGY.LIST);
            return {
                data: Array.isArray(response.data) ? response.data :
                    Array.isArray(response.data?.data) ? response.data.data : []
            };
        } catch (error) {
            console.error('Error fetching technology list:', error);
            throw error;
        }
    },

    getTechnologyById: async (id) => {
        try {
            const response = await apiService.get(ENDPOINTS.TECHNOLOGY.DETAIL(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching technology:', error);
            throw error;
        }
    },

    createTechnology: async (data) => {
        try {
            const response = await apiService.post(ENDPOINTS.TECHNOLOGY.CREATE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating technology:', error);
            throw error;
        }
    },

    updateTechnology: async (id, data) => {
        try {
            const response = await apiService.put(ENDPOINTS.TECHNOLOGY.UPDATE(id), data);
            return response.data;
        } catch (error) {
            console.error('Error updating technology:', error);
            throw error;
        }
    },

    deleteTechnology: async (id) => {
        try {
            const response = await apiService.delete(ENDPOINTS.TECHNOLOGY.DELETE(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting technology:', error);
            throw error;
        }
    },

    // Why GudMed methods
    getWhyGudMedList: async () => {
        try {
            const response = await apiService.get(ENDPOINTS.WHY_GUDMED.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching why gudmed list:', error);
            throw error;
        }
    },

    getWhyGudMedById: async (id) => {
        try {
            const response = await apiService.get(ENDPOINTS.WHY_GUDMED.DETAIL(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching why gudmed:', error);
            throw error;
        }
    },

    createWhyGudMed: async (data) => {
        try {
            const response = await apiService.post(ENDPOINTS.WHY_GUDMED.CREATE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating why gudmed:', error);
            throw error;
        }
    },

    updateWhyGudMed: async (id, data) => {
        try {
            const response = await apiService.put(ENDPOINTS.WHY_GUDMED.UPDATE(id), data);
            return response.data;
        } catch (error) {
            console.error('Error updating why gudmed:', error);
            throw error;
        }
    },

    deleteWhyGudMed: async (id) => {
        try {
            const response = await apiService.delete(ENDPOINTS.WHY_GUDMED.DELETE(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting why gudmed:', error);
            throw error;
        }
    },

    // Unique points methods
    createUniquePoint: async (data) => {
        try {
            const response = await apiService.post(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.CREATE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating unique point:', error);
            throw error;
        }
    },

    updateUniquePoint: async (id, data) => {
        try {
            const response = await apiService.put(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.UPDATE(id), data);
            return response.data;
        } catch (error) {
            console.error('Error updating unique point:', error);
            throw error;
        }
    },

    deleteUniquePoint: async (id) => {
        try {
            const response = await apiService.delete(ENDPOINTS.WHY_GUDMED.UNIQUE_POINTS.DELETE(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting unique point:', error);
            throw error;
        }
    }
};

export default pagesService; 