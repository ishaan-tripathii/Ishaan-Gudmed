import { Server } from 'socket.io';

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://gudmed-frontend.onrender.com',
        'https://gudmed-admin.onrender.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle component-specific events
    const handleComponentEvent = (componentType, eventType, data) => {
      const eventName = `${componentType}_${eventType}`;
      console.log(`Broadcasting ${eventName}:`, data);
      io.emit(eventName, data);
    };

    // Listen for component events
    socket.on('whyGudMed_create', (data) => handleComponentEvent('whyGudMed', 'created', data));
    socket.on('whyGudMed_update', (data) => handleComponentEvent('whyGudMed', 'updated', data));
    socket.on('whyGudMed_delete', (data) => handleComponentEvent('whyGudMed', 'deleted', data));

    socket.on('slider_create', (data) => handleComponentEvent('slider', 'created', data));
    socket.on('slider_update', (data) => handleComponentEvent('slider', 'updated', data));
    socket.on('slider_delete', (data) => handleComponentEvent('slider', 'deleted', data));

    socket.on('clientele_create', (data) => handleComponentEvent('clientele', 'created', data));
    socket.on('clientele_update', (data) => handleComponentEvent('clientele', 'updated', data));
    socket.on('clientele_delete', (data) => handleComponentEvent('clientele', 'deleted', data));

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return httpServer;
};

const notifyClients = (componentType, eventType, data) => {
  if (!io) {
    console.error("Socket.IO not initialized");
    return;
  }

  try {
    const eventName = `${componentType}_${eventType}d`;
    console.log(`Emitting ${eventName}:`, data);
    io.emit(eventName, data);
  } catch (error) {
    console.error("Error notifying clients:", error);
  }
};

export { initSocket, notifyClients };