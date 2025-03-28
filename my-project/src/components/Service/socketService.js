// socketService.js
import { io } from "socket.io-client";

// Use environment variable for the Socket.IO URL, fallback to localhost for development
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: 10,         // Retry connection up to 10 times
      reconnectionDelay: 1000,         // Wait 1s between retries
      reconnectionDelayMax: 5000,      // Max delay of 5s
      timeout: 20000,                  // Connection timeout of 20s
      autoConnect: true,               // Connect automatically
      path: "/socket.io",              // Socket.IO endpoint
      transports: ["websocket", "polling"], // Support both transports
      withCredentials: true,           // Send credentials (if needed)
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onStepByStepUpdate = (callback) => {
  if (socket) {
    socket.on("step_by_step_update", callback);
  }
};

export const onStepByStepCreate = (callback) => {
  if (socket) {
    socket.on("step_by_step_create", callback);
  }
};

export const onStepByStepDelete = (callback) => {
  if (socket) {
    socket.on("step_by_step_delete", callback);
  }
};