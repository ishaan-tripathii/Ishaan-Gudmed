import io from 'socket.io-client';

export const socket = io('http://localhost:5000');

// Debug logs for connection
socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO connection error:', error);
});