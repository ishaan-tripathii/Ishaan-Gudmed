const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com';
    }
    return 'http://localhost:5000';
};

const config = {
    apiUrl: getBaseUrl(),
    endpoints: {
        // Auth endpoints
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',

        // Pages endpoints
        pages: '/api/pages',
        uniquePoints: '/api/why-gudmed',
        clients: '/api/clients',
        settings: '/api/settings',

        // Health check
        health: '/api/health'
    },
    socketConfig: {
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling']
    }
};

// Helper function to get full URL for endpoints
config.getUrl = (endpoint) => `${config.apiUrl}${endpoint}`;

module.exports = config; 