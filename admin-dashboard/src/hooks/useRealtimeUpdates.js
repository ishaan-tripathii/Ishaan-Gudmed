import { useEffect, useCallback, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

// Use environment variable for socket connection
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Create a single socket instance that persists across the app
let socket = null;

const initSocket = () => {
    if (!socket) {
        console.log('Initializing socket connection to:', SOCKET_URL);
        socket = io(SOCKET_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('Socket connected successfully:', socket.id);
            toast.success('Connected to real-time updates');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            toast.error('Failed to connect to real-time updates');
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            toast.warn('Disconnected from real-time updates');
        });
    }
    return socket;
};

export const useRealtimeUpdates = (componentType) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize socket once
    useEffect(() => {
        const socketInstance = initSocket();
        console.log(`Setting up listeners for ${componentType}`);

        // Handle create events
        socketInstance.on(`${componentType}_created`, (newItem) => {
            console.log(`${componentType} created:`, newItem);
            setData(prev => [...prev, newItem]);
            toast.success(`New ${componentType} created`);
        });

        // Handle update events
        socketInstance.on(`${componentType}_updated`, (updatedItem) => {
            console.log(`${componentType} updated:`, updatedItem);
            setData(prev => prev.map(item =>
                item._id === updatedItem._id ? updatedItem : item
            ));
            toast.success(`${componentType} updated`);
        });

        // Handle delete events
        socketInstance.on(`${componentType}_deleted`, (deletedId) => {
            console.log(`${componentType} deleted:`, deletedId);
            setData(prev => prev.filter(item => item._id !== deletedId));
            toast.success(`${componentType} deleted`);
        });

        // Cleanup function
        return () => {
            console.log(`Cleaning up listeners for ${componentType}`);
            socketInstance.off(`${componentType}_created`);
            socketInstance.off(`${componentType}_updated`);
            socketInstance.off(`${componentType}_deleted`);
        };
    }, [componentType]);

    // Function to emit events
    const emitEvent = useCallback((eventType, data) => {
        const socketInstance = initSocket();
        const eventName = `${componentType}_${eventType}`;
        console.log(`Emitting ${eventName}:`, data);
        socketInstance.emit(eventName, data);
    }, [componentType]);

    // Function to fetch initial data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SOCKET_URL}/api/${componentType}`);
            const result = await response.json();
            console.log(`Fetched ${componentType} data:`, result);
            setData(result);
        } catch (error) {
            console.error(`Error fetching ${componentType}:`, error);
            toast.error(`Failed to fetch ${componentType}`);
        } finally {
            setLoading(false);
        }
    }, [componentType]);

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, emitEvent, refetch: fetchData };
}; 