import apiService from './apiService';
import { ENDPOINTS } from '../../config/api.config';

const pagesService = {
    // Get all pages
    getPages: async () => {
        return apiService.pages.getAll();
    },

    // Get a single page by ID
    getPage: async (id) => {
        return apiService.pages.getById(id);
    },

    // Create a new page
    createPage: async (pageData) => {
        return apiService.pages.create(pageData);
    },

    // Update an existing page
    updatePage: async (id, pageData) => {
        return apiService.pages.update(id, pageData);
    },

    // Delete a page
    deletePage: async (id) => {
        return apiService.pages.delete(id);
    },

    // Why GudMed Unique Points Methods
    getUniquePoints: async () => {
        try {
            const response = await apiService.get(ENDPOINTS.UNIQUE_POINTS.LIST);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching unique points:', error);
            throw error;
        }
    },

    createUniquePoint: async (pointData) => {
        try {
            const response = await apiService.post(ENDPOINTS.UNIQUE_POINTS.CREATE, pointData);
            return response.data;
        } catch (error) {
            console.error('Error creating unique point:', error);
            throw error;
        }
    },

    updateUniquePoint: async (id, pointData) => {
        try {
            const response = await apiService.put(ENDPOINTS.UNIQUE_POINTS.UPDATE(id), pointData);
            return response.data;
        } catch (error) {
            console.error('Error updating unique point:', error);
            throw error;
        }
    },

    deleteUniquePoint: async (id) => {
        try {
            const response = await apiService.delete(ENDPOINTS.UNIQUE_POINTS.DELETE(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting unique point:', error);
            throw error;
        }
    }
};

export default pagesService; 