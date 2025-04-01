import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { ENDPOINTS } from '../utils/api';
import { socket } from '../socket';
import { toast } from 'react-toastify';

const PagesContext = createContext();

export const usePagesContext = () => {
    const context = useContext(PagesContext);
    if (!context) {
        throw new Error('usePagesContext must be used within a PagesProvider');
    }
    return context;
};

export const PagesProvider = ({ children }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [techPage, setTechPage] = useState(null);
    const [aiPage, setAiPage] = useState(null);
    const [whyGudmedPage, setWhyGudmedPage] = useState(null);

    const fetchPages = async () => {
        try {
            setLoading(true);
            console.log('Fetching pages...');

            // Fetch all pages
            const pagesResponse = await api.get(ENDPOINTS.PAGES.LIST);
            console.log('Pages data:', pagesResponse.data);
            setPages(pagesResponse.data || []);

            // Fetch technology page
            try {
                const techResponse = await api.get(ENDPOINTS.TECHNOLOGY.LIST);
                console.log('Technology page data:', techResponse.data);
                setTechPage(techResponse.data);
            } catch (error) {
                console.error('Error fetching technology page:', error);
            }

            // Fetch AI page
            try {
                const aiResponse = await api.get(ENDPOINTS.AI_PAGES.LIST);
                console.log('AI page data:', aiResponse.data);
                setAiPage(aiResponse.data);
            } catch (error) {
                console.error('Error fetching AI page:', error);
            }

            // Fetch Why GudMed page
            try {
                const whyGudmedResponse = await api.get(ENDPOINTS.WHY_GUDMED.LIST);
                console.log('Why GudMed page data:', whyGudmedResponse.data);
                setWhyGudmedPage(whyGudmedResponse.data);
            } catch (error) {
                console.error('Error fetching Why GudMed page:', error);
            }

            setError(null);
        } catch (error) {
            console.error('Error fetching pages:', error);
            setError(error.message);
            toast.error('Failed to load page content. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('pageUpdate', (updatedPages) => {
            console.log('Received page update:', updatedPages);
            setPages(updatedPages);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.off('pageUpdate');
            socket.off('connect');
            socket.off('connect_error');
        };
    }, []);

    // Helper functions to get specific pages
    const getSliderPages = () => {
        console.log('Getting slider pages. All pages:', pages);
        const sliderPages = pages.filter(page => page.type === 'slider' || page.slug?.includes('slide'));
        console.log('Found slider pages:', sliderPages);
        return sliderPages;
    };

    const getTechnologyPage = () => {
        console.log('Getting technology page:', techPage);
        return techPage;
    };

    const getAiPage = () => {
        console.log('Getting AI page:', aiPage);
        return aiPage;
    };

    const getWhyGudmedUniquePage = () => {
        console.log('Getting Why GudMed page:', whyGudmedPage);
        return whyGudmedPage;
    };

    const value = {
        pages,
        loading,
        error,
        getSliderPages,
        getTechnologyPage,
        getAiPage,
        getWhyGudmedUniquePage,
        refetch: fetchPages,
    };

    return (
        <PagesContext.Provider value={value}>
            {children}
        </PagesContext.Provider>
    );
}; 