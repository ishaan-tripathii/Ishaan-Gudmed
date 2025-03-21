const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
    env: process.env.REACT_APP_ENV || 'development',
    isProduction: process.env.REACT_APP_ENV === 'production'
};

export default config; 