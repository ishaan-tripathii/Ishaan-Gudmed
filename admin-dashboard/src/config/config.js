const config = {
    API_URL: 'https://gudmed-backend.onrender.com',
    SOCKET_URL: 'https://gudmed-backend.onrender.com',
    ENV: 'production',
    isProduction: process.env.REACT_APP_ENV === 'production',
    SOCKET_OPTIONS: {
        transports: ['websocket', 'polling'],
        secure: true,
        rejectUnauthorized: false
    }
};

export default config; 