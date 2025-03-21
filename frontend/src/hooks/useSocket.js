import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import config from '../../../shared/config';

export const useSocket = () => {
    const socketRef = useRef(null);
    const retryCount = useRef(0);

    const connectSocket = useCallback(() => {
        if (socketRef.current?.connected) return;

        socketRef.current = io(config.apiUrl, {
            ...config.socketConfig,
            autoConnect: true
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected successfully');
            retryCount.current = 0;
            toast.success('Real-time connection established');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            retryCount.current += 1;

            if (retryCount.current >= config.socketConfig.reconnectionAttempts) {
                toast.error('Unable to establish real-time connection. Please refresh the page.');
            }

            // Fall back to polling if websocket fails
            if (socketRef.current.io.opts.transports[0] === 'websocket') {
                console.log('Falling back to polling transport');
                socketRef.current.io.opts.transports = ['polling'];
            }
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            toast.warning('Real-time connection lost. Attempting to reconnect...');

            if (reason === 'io server disconnect' || reason === 'transport close') {
                socketRef.current.connect();
            }
        });

        // Listen for content updates
        socketRef.current.on('contentChanged', (data) => {
            console.log('Content updated:', data);
            // You can dispatch an action or update state here
        });

        // Handle errors
        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
            toast.error('Connection error occurred');
        });
    }, []);

    useEffect(() => {
        connectSocket();

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [connectSocket]);

    // Return both socket and reconnect function
    return {
        socket: socketRef.current,
        reconnect: connectSocket
    };
};

export default useSocket; 