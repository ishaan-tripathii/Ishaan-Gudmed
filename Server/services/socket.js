// services/socket.js
import { Server } from "socket.io";

let ioInstance;

export const initSocket = (httpServer) => {
  if (!ioInstance) {
    ioInstance = new Server(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://gudmed-frontend.onrender.com",
          "https://gudmed-admin.onrender.com",
          "https://gudmed-backend.onrender.com",
          "https://www.gudmed.in",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
      },
    });

    ioInstance.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
    });
  }
  return ioInstance;
};

export const notifyClients = (componentType, eventType, data) => {
  if (!ioInstance) {
    console.error("Socket.IO not initialized. Call initSocket first.");
    return;
  }
  const eventName = `${componentType}_${eventType}`;
  console.log(`Emitting ${eventName}:`, data);
  ioInstance.emit(eventName, data);
};