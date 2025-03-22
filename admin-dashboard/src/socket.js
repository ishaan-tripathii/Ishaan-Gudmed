import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://gudmed-backend.onrender.com';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Debug logs for connection
socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});