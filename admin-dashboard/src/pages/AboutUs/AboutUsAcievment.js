import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

// Initialize Socket.IO connection
const socket = io('http://localhost:5000');
const API_URL = 'http://localhost:5000/api/ourachievements';

const AboutUsAcievment = () => {
    // State for storing achievements data
    const [ourachievements, setOurachievements] = useState(null);
    // State for form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cards: [{
            icon: '',
            iconColor: '#000000',
            title: '',
            description: '',
        }],
    });

    // Fetch initial data and set up socket listeners
    useEffect(() => {
        fetchOurachievments();

        // Listener for new achievements
        socket.on('ourAchievements_created', (data) => {
            setOurachievements(data);
            setFormData(data || {
                title: '',
                description: '',
                cards: [{
                    icon: '',
                    iconColor: '#000000',
                    title: '',
                    description: '',
                }],
            });
            toast.success('Our Achievements created in real-time!');
        });

        // Listener for updated achievements
        socket.on('ourAchievements_updated', (data) => {
            setOurachievements(data);
            setFormData(data || {
                title: '',
                description: '',
                cards: [{
                    icon: '',
                    iconColor: '#000000',
                    title: '',
                    description: '',
                }],
            });
            toast.success('Our Achievements updated in real-time!');
        });

        // Listener for deleted achievements
        socket.on('ourAchievements_deleted', () => {
            setOurachievements(null);
            setFormData({
                title: '',
                description: '',
                cards: [{
                    icon: '',
                    iconColor: '#000000',
                    title: '',
                    description: '',
                }],
            });
            toast.success('Our Achievements deleted in real-time!');
        });

        // Cleanup socket listeners on component unmount
        return () => {
            socket.off('ourAchievements_created');
            socket.off('ourAchievements_updated');
            socket.off('ourAchievements_deleted');
        };
    }, []);

    // Fetch achievements data from the API
    const fetchOurachievments = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.success && response.data.data) {
                const fetchedData = response.data.data;
                setOurachievements(fetchedData);
                setFormData({
                    title: fetchedData.title || '',
                    description: fetchedData.description || '',
                    cards: fetchedData.cards && fetchedData.cards.length > 0 
                        ? fetchedData.cards.map(card => ({
                            icon: card.icon || '',
                            iconColor: card.iconColor || '#000000',
                            title: card.title || '',
                            description: card.description || '',
                        }))
                        : [{
                            icon: '',
                            iconColor: '#000000',
                            title: '',
                            description: '',
                        }],
                });
            }
        } catch (error) {
            console.log('Error in fetching ourAchievements data:', error);
            toast.error('Failed to fetch Our Achievements data');
        }
    };

    // Handle changes to top-level form fields (title, description)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle changes to card fields
    const handleCardChange = (index, field, value) => {
        const newCards = [...formData.cards];
        newCards[index][field] = value;
        setFormData({ ...formData, cards: newCards });
    };

    // Add a new card to the form
    const addCard = () => {
        setFormData({
            ...formData,
            cards: [...formData.cards, {
                icon: '',
                iconColor: '#000000',
                title: '',
                description: '',
            }],
        });
    };

    // Delete a card from the form
    const deleteCard = (index) => {
        if (formData.cards.length === 1) {
            toast.error('You must have at least one card');
            return;
        }
        const newCards = formData.cards.filter((_, i) => i !== index);
        setFormData({ ...formData, cards: newCards });
    };

    // Handle form submission for creating new achievements
    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success('Successfully created Our Achievements content');
                // Socket event will handle the update
            }
        } catch (error) {
            console.log('Error creating Our Achievements content:', error.response?.data || error.message);
            toast.error('Failed to create Our Achievements content');
        }
    };

    // Handle form submission for updating existing achievements
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!ourachievements?._id) {
            toast.error('No data to update. Please create data first or refresh the page.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No authentication token found. Please log in.');
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/${ourachievements._id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success('Successfully updated Our Achievements content');
                // Socket event will handle the update
            } else {
                toast.error('Failed to update Our Achievements content: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.log('Error updating Our Achievements content:', error.response?.data || error.message);
            toast.error('Failed to update Our Achievements content: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle deletion of achievements
    const handleDelete = async () => {
        if (!ourachievements?._id) {
            toast.error('No data found to delete');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_URL}/${ourachievements._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                toast.success('Successfully deleted Our Achievements content');
                // Socket event will handle the update
            }
        } catch (error) {
            console.log('Error deleting Our Achievements content:', error.response?.data || error.message);
            toast.error('Failed to delete Our Achievements content');
        }
    };

    // Validate hex color code
    const validateColorCode = (value) => {
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        return hexColorRegex.test(value);
    };

    // Render the component
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <h1 className="text-3xl font-bold mb-4">Manage Our Achievements</h1>
            <form onSubmit={ourachievements ? handleUpdate : handleCreate}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        className="w-full p-2 border rounded" 
                        placeholder="Enter title" 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        className="w-full p-2 border rounded" 
                        placeholder="Enter description" 
                    />
                </div>

                {formData.cards.map((card, index) => (
                    <div key={index} className="mb-4 p-4 border rounded relative">
                        <h3 className="text-lg font-semibold mb-2">Card {index + 1}</h3>
                        <div className="mb-2">
                            <label className="block text-gray-700">Icon Name (e.g., FaHospital)</label>
                            <input 
                                type="text" 
                                value={card.icon}
                                onChange={(e) => handleCardChange(index, 'icon', e.target.value)}
                                className="w-full p-2 border rounded" 
                                placeholder="Enter icon name (e.g., FaHospital)"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Examples: FaHospital, FaUserMd, FaGlobe, FaAward, FaChartLine, MdHealthAndSafety, MdOutlineScience
                            </p>
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Icon Color (e.g., #FF0000)</label>
                            <input 
                                type="text" 
                                value={card.iconColor}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || validateColorCode(value)) {
                                        handleCardChange(index, 'iconColor', value);
                                    }
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="Enter hex color code (e.g., #FF0000)"
                                maxLength={7}
                            />
                            <div 
                                className="w-8 h-8 mt-2 border rounded"
                                style={{ backgroundColor: card.iconColor }}
                            />
                            {!validateColorCode(card.iconColor) && card.iconColor !== '' && (
                                <p className="text-red-500 text-sm mt-1">
                                    Please enter a valid hex color code (e.g., #FF0000)
                                </p>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Title</label>
                            <input 
                                type="text" 
                                value={card.title}
                                onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                                className="w-full p-2 border rounded" 
                                placeholder="Enter card title" 
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Description</label>
                            <textarea 
                                value={card.description}
                                onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                                className="w-full p-2 border rounded" 
                                placeholder="Enter card description" 
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => deleteCard(index)}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete Card
                        </button>
                    </div>
                ))}

                <button 
                    type="button" 
                    onClick={addCard}
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Add New Card
                </button>
                <div className="flex space-x-4">
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                        disabled={formData.cards.some(card => !validateColorCode(card.iconColor) && card.iconColor !== '')}
                    >
                        {ourachievements ? 'Update' : 'Create'}
                    </button>
                    {ourachievements && (
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete All
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AboutUsAcievment;