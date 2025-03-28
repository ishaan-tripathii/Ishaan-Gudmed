import { io } from "socket.io-client";
import config from "../config/config"; // Ensure this points to your api.js file

let socket = null;

export const getSocket = () => {
  if (!socket) {
    // Use SOCKET_URL from config, falling back to http://localhost:5000 for development
    const socketUrl = config.SOCKET_URL || "http://localhost:5000";
    console.log("Initializing Socket.IO connection to:", socketUrl);

    socket = io(socketUrl, {
      reconnectionAttempts: 10, // Retry connection up to 10 times
      reconnectionDelay: 1000, // Wait 1s between retries
      reconnectionDelayMax: 5000, // Max delay of 5s
      timeout: 20000, // Connection timeout of 20s
      autoConnect: true, // Connect immediately
      path: "/socket.io", // Match backend path
      transports: ["websocket", "polling"], // Support both transports
      withCredentials: true, // Enable credentials for CORS
    });

    // Connection success
    socket.on("connect", () => {
      console.log("Socket.IO connected successfully:", socket.id);
    });

    // Disconnection handling
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      if (reason === "io server disconnect") {
        console.log("Attempting to reconnect...");
        socket.connect();
      }
    });

    // Connection error
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    // General error
    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    // Reconnection attempt
    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("Socket.IO reconnection attempt:", attemptNumber);
    });

    // Reconnection failed
    socket.on("reconnect_failed", () => {
      console.error("Socket.IO reconnection failed");
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting Socket.IO...");
    socket.disconnect();
    socket = null;
  }
};