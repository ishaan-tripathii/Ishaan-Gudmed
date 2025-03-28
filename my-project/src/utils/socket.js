// socket.js (frontend)
import { io } from "socket.io-client";
import config from "../config/config";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = config.SOCKET_URL || "https://gudmed-backend.onrender.com";
    console.log("Initializing Socket.IO connection to:", socketUrl);

    socket = io(socketUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected successfully:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.error("Socket.IO disconnected:", reason);
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("Socket.IO reconnection attempt:", attemptNumber);
    });

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