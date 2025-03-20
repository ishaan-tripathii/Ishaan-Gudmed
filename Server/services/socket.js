import { Server } from 'socket.io';

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'], // Adjust based on your frontend port
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const notifyClients = (event, data) => {
  if (io) {
    // console.log(`Emitting event: ${event}`, data); // Debug log
    io.emit(event, data); // Emit the specified event with data
  } else {
    console.error("Socket.IO not initialized");
  }
};

export { initSocket, notifyClients };