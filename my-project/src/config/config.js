export const config = {
    API_URL: process.env.REACT_APP_API_URL || 'https://gudmed-backend.onrender.com',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://gudmed-backend.onrender.com',
    ENV: process.env.NODE_ENV || 'development',
    SOCKET_OPTIONS: {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        secure: true,
        rejectUnauthorized: false,
        path: '/socket.io',
        autoConnect: true,
        forceNew: true
    }
};

export default config; 