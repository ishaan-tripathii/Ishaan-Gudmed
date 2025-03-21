import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import apiConfig from '../config/api.config';

const useContentSocket = (contentType, onUpdate) => {
    useEffect(() => {
        const socket = io(apiConfig.getSocketUrl(), {
            reconnection: true,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            if (apiConfig.ENABLE_LOGS) {
                console.log('Socket connected:', socket.id);
            }
        });

        socket.on(`${contentType}Updated`, (data) => {
            if (apiConfig.ENABLE_LOGS) {
                console.log(`${contentType} update received:`, data);
            }
            onUpdate(data);
        });

        socket.on('connect_error', (err) => {
            if (apiConfig.ENABLE_LOGS) {
                console.error('Socket connection error:', err.message);
            }
        });

        socket.on('disconnect', (reason) => {
            if (apiConfig.ENABLE_LOGS) {
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