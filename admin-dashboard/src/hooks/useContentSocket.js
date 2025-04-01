import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { config } from '../config/api.config';

const useContentSocket = (contentType, onUpdate) => {
    useEffect(() => {
        const token = localStorage.getItem('token');

        const socket = io(config.getSocketUrl(), {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            transports: ['websocket'],
            auth: token ? { token } : undefined
        });

        socket.on('connect', () => {
            if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
                console.log('Socket connected:', socket.id);
            }
        });

        socket.on(`${contentType}Updated`, (data) => {
            if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
                console.log(`${contentType} update received:`, data);
            }
            onUpdate(data);
        });

        socket.on('connect_error', (err) => {
            if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
                console.error('Socket connection error:', err.message);
            }
        });

        socket.on('disconnect', (reason) => {
            if (process.env.REACT_APP_ENABLE_LOGS === 'true') {
                console.log('Socket disconnected:', reason);
            }
        });

        return () => {
            socket.off(`${contentType}Updated`);
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.close();
        };
    }, [contentType, onUpdate]);
};

export default useContentSocket; 