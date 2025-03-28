const isProduction = process.env.NODE_ENV === "production";

const config = {
    apiBaseUrl: isProduction ? "https://your-production-api.com" : "http://localhost:5000",
    socketBaseUrl: isProduction ? "https://your-production-socket.com" : "http://localhost:5000",
};

export default config;
