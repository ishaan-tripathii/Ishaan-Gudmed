import { Server } from 'socket.io';

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'], // Adjust based on your frontend port
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });
};

const notifyClients = () => {
  if (io) {
    io.emit('contentUpdated'); // Emit event to all connected clients
  }
};

export { initSocket, notifyClients };