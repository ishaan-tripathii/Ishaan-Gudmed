import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { config } from '../config/api.config';
import { toast } from 'react-toastify';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            return;
        }

        const socketInstance = io(config.SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            forceNew: true
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
            setIsConnected(true);
            setError(null);
            toast.success('Connected to server');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setError(error.message);
            setIsConnected(false);
            toast.error('Connection error: ' + error.message);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                console.log('Server disconnected, attempting to reconnect...');
                socketInstance.connect();
            }
        });

        socketInstance.on('reconnect_attempt', (attemptNumber) => {
            console.log('Reconnection attempt:', attemptNumber);
        });

        socketInstance.on('reconnect', () => {
            console.log('Reconnected to server');
            setIsConnected(true);
            setError(null);
            toast.success('Reconnected to server');
        });

        socketInstance.on('reconnect_error', (error) => {
            console.error('Reconnection error:', error);
        });

        socketInstance.on('reconnect_failed', () => {
            console.error('Failed to reconnect');
            toast.error('Failed to reconnect to server');
        });

        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket connection');
                socketInstance.disconnect();
            }
        };
    }, []);

    return { socket, isConnected, error };
}; 