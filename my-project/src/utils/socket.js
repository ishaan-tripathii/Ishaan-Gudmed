import { io } from 'socket.io-client';
import config from '../config/config';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        console.log('Initializing Socket.IO connection to:', config.SOCKET_URL);
        socket = io(config.SOCKET_URL, {
            ...config.SOCKET_OPTIONS,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            forceNew: true
        });

        socket.on('connect', () => {
            console.log('Socket.IO connected successfully:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Reconnect if server disconnected
                console.log('Attempting to reconnect...');
                socket.connect();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message);
        });

        socket.on('error', (error) => {
            console.error('Socket.IO error:', error);
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log('Socket.IO reconnection attempt:', attemptNumber);
        });

        socket.on('reconnect_failed', () => {
            console.error('Socket.IO reconnection failed');
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting Socket.IO...');
        socket.disconnect();
        socket = null;
    }
}; 