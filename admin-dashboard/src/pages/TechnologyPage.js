import React, { useState, useEffect } from 'react';
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates';
import pagesService from '../services/api/pagesService';
import { toast } from 'react-toastify';

const TechnologyPage = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTechnologies = async () => {
        try {
            const data = await pagesService.getTechnologyList();
            setTechnologies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching technologies:', error);
            setError(error.message);
            setLoading(false);
            toast.error('Failed to fetch technologies');
        }
    };

    // Handle real-time updates
    useRealtimeUpdates(
        ['technology:create', 'technology:update', 'technology:delete'],
        (data) => {
            console.log('Received technology update:', data);
            fetchTechnologies(); // Refresh the data
        }
    );

    useEffect(() => {
        fetchTechnologies();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {/* Your existing JSX */}
        </div>
    );
};

export default TechnologyPage; 