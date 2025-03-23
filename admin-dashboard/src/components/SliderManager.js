import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';

const SliderManager = () => {
    const { socket, isConnected, error } = useSocket();
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!socket) {
            console.log('Socket not initialized');
            return;
        }

        // Listen for slider updates
        socket.on('slider:update', (updatedSlider) => {
            setSliders(prevSliders =>
                prevSliders.map(slider =>
                    slider._id === updatedSlider._id ? updatedSlider : slider
                )
            );
        });

        // Listen for new sliders
        socket.on('slider:create', (newSlider) => {
            setSliders(prevSliders => [...prevSliders, newSlider]);
        });

        // Listen for deleted sliders
        socket.on('slider:delete', (deletedId) => {
            setSliders(prevSliders =>
                prevSliders.filter(slider => slider._id !== deletedId)
            );
        });

        // Cleanup socket listeners
        return () => {
            if (socket) {
                socket.off('slider:update');
                socket.off('slider:create');
                socket.off('slider:delete');
            }
        };
    }, [socket]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!isConnected) {
        return <div>Connecting to server...</div>;
    }

    return (
        <div>
            {/* Your slider management UI */}
        </div>
    );
};

export default SliderManager; 