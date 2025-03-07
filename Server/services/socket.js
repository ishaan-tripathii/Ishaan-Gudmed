import { Server } from 'socket.io';

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow these origins
      methods: ['GET', 'POST'], // Allowed methods for Socket.io
      credentials: true, // Allow credentials (cookies, etc.)
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
};

const notifyClients = (slug) => {
  if (io) {
    io.emit('contentUpdated', { slug });
  }
};

export { initSocket, notifyClients };