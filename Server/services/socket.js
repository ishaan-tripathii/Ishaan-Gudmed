import { Server } from 'socket.io';

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'https://my-project.onrender.com', 'https://gudmed-admin.onrender.com'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return httpServer;
};

const notifyClients = (event, data) => {
  if (io) {
    console.log(`Emitting event: ${event}`, data);
    io.emit(event, data);
  } else {
    console.error("Socket.IO not initialized");
  }
};

export { initSocket, notifyClients };