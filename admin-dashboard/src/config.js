const isProduction = process.env.NODE_ENV === "production";

const config = {
    apiBaseUrl: isProduction ? "https://gudmed-backend.onrender.com" : "http://localhost:5000",
    socketBaseUrl: isProduction ? "https://gudmed-backend.onrender.com" : "http://localhost:5000",
};

export default config;
