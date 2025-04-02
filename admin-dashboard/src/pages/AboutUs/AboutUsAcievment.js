import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
// Example icon imports (adjust based on your actual icons)
import { FaHospital, FaUserMd, FaGlobe, FaAward, FaChartLine } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlineScience } from 'react-icons/md';

const socket = io('http://localhost:5000');
const API_URL = 'http://localhost:5000/api/ourachievements';

const AboutUsAcievment = () => {
    const [ourachievements, setOurachievements] = useState(null);
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

    useEffect(() => {
        fetchOurachievments();

        socket.on('ourachievementsUpdated', (data) => {
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
        });

        return () => socket.off('ourachievementsUpdated');
    }, []);

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
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (index, field, value) => {
        const newCards = [...formData.cards];
        newCards[index][field] = value;
        setFormData({ ...formData, cards: newCards });
    };

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

    const deleteCard = (index) => {
        if (formData.cards.length === 1) {
            alert('You must have at least one card');
            return;
        }
        const newCards = formData.cards.filter((_, i) => i !== index);
        setFormData({ ...formData, cards: newCards });
    };

    const validateColorCode = (value) => {
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        return hexColorRegex.test(value);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (formData.cards.some(card => card.iconColor && !validateColorCode(card.iconColor))) {
            alert('Please enter valid hex color codes for all cards (e.g., #FF0000)');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                alert('Successfully created ourachievements content');
                fetchOurachievments();
            }
        } catch (error) {
            console.log('Error creating ourachievements content:', error.response?.data || error.message);
            alert('Failed to create ourachievements content');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!ourachievements?._id) {
            alert('No data to update. Please create data first or refresh the page.');
            return;
        }
        if (formData.cards.some(card => card.iconColor && !validateColorCode(card.iconColor))) {
            alert('Please enter valid hex color codes for all cards (e.g., #FF0000)');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No authentication token found. Please log in.');
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
                alert('Successfully updated ourachievements content');
                fetchOurachievments();
            } else {
                alert('Failed to update ourachievements content: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.log('Error updating ourachievements content:', error.response?.data || error.message);
            alert('Failed to update ourachievements content: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async () => {
        if (!ourachievements?._id) {
            alert('No data found to delete');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_URL}/${ourachievements._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                alert('Successfully deleted ourachievements content');
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
            }
        } catch (error) {
            console.log('Error deleting ourachievements content:', error.response?.data || error.message);
            alert('Failed to delete ourachievements content');
        }
    };

    // Map icon names to components (adjust this based on your actual icons)
    const iconMap = {
        FaHospital: FaHospital,
        FaUserMd: FaUserMd,
        FaGlobe: FaGlobe,
        FaAward: FaAward,
        FaChartLine: FaChartLine,
        MdHealthAndSafety: MdHealthAndSafety,
        MdOutlineScience: MdOutlineScience,
    };

    const renderIcon = (iconName, color) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent color={color} size={30} /> : null;
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
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
                            {card.icon && renderIcon(card.icon, card.iconColor) && (
                                <div className="mt-2">{renderIcon(card.icon, card.iconColor)}</div>
                            )}
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Icon Color (e.g., #FF0000)</label>
                            <input 
                                type="text" 
                                value={card.iconColor}
                                onChange={(e) => handleCardChange(index, 'iconColor', e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="Enter hex color code (e.g., #FF0000)"
                                maxLength={7}
                            />
                            <input
                                type="color"
                                value={card.iconColor}
                                onChange={(e) => handleCardChange(index, 'iconColor', e.target.value)}
                                className="mt-2"
                            />
                            <div 
                                className="w-8 h-8 mt-2 border rounded inline-block ml-2"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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