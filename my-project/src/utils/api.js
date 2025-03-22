import axios from 'axios';
import config from '../config/config';

const api = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getImageUrl = (path) => {
    return `${config.API_URL}${path}`;
};

export default api; 