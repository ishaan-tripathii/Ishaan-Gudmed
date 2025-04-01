import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pagesService from "../../services/api/pagesService";
import { useRealtimeUpdates } from "../../hooks/useRealtimeUpdates";

const AnimatedTextManager = () => {
    const [texts, setTexts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentText, setCurrentText] = useState(null);
    const [formData, setFormData] = useState({
        redMarquee: [{ text: "", icon: "" }],
        blackMarquee: [{ text: "", icon: "" }],
    });

    // Fetch texts from the server
    const fetchTexts = async () => {
        try {
            setIsLoading(true);
            const response = await pagesService.getAnimatedTextList();
            setTexts(response?.data || []);
        } catch (err) {
            console.error("Error fetching texts:", err);
            toast.error("Failed to load texts");
        } finally {
            setIsLoading(false);
        }
    };

    // Setup real-time updates
    const { emitEvent } = useRealtimeUpdates('animatedText', (eventType, data) => {
        switch (eventType) {
            case 'create':
                setTexts(prev => [...prev, data]);
                toast.success('New text created in real-time!');
                break;
            case 'update':
                setTexts(prev => prev.map(text =>
                    text._id === data._id ? data : text
                ));
                toast.success('Text updated in real-time!');
                break;
            case 'delete':
                setTexts(prev => prev.filter(text => text._id !== data._id));
                toast.success('Text deleted in real-time!');
                break;
        }
    });

    useEffect(() => {
        fetchTexts();
    }, []);

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            redMarquee: [{ text: "", icon: "" }],
            blackMarquee: [{ text: "", icon: "" }],
        });
        setCurrentText(null);
    };

    // Handle edit button click
    const handleEdit = (text) => {
        setCurrentText(text);
        setFormData({
            redMarquee: text.redMarquee || [{ text: "", icon: "" }],
            blackMarquee: text.blackMarquee || [{ text: "", icon: "" }],
        });
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this text?")) return;
        try {
            await pagesService.deleteAnimatedText(id);
            emitEvent('delete', { _id: id });
            toast.success("Text deleted successfully");
        } catch (err) {
            toast.error("Failed to delete text");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (currentText) {
                response = await pagesService.updateAnimatedText(currentText._id, formData);
                emitEvent('update', response.data);
                toast.success("Text updated successfully");
            } else {
                response = await pagesService.createAnimatedText(formData);
                emitEvent('create', response.data);
                toast.success("Text created successfully");
            }
            resetForm();
        } catch (err) {
            toast.error("Failed to save text");
        } finally {
            setIsLoading(false);
        }
    };

    // Marquee item handlers
    const addMarqueeItem = (type) => {
        setFormData({
            ...formData,
            [type]: [...formData[type], { text: "", icon: "" }],
        });
    };

    const handleMarqueeChange = (type, index, field, value) => {
        const updatedMarquee = formData[type].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setFormData({ ...formData, [type]: updatedMarquee });
    };

    const handleDeleteMarqueeItem = (type, index) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        const updatedMarquee = formData[type].filter((_, i) => i !== index);
        setFormData({ ...formData, [type]: updatedMarquee });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Animated Text Manager</h1>
            <ToastContainer />

            {/* Form Section */}
            <h2 className="text-2xl font-semibold mb-4">
                {currentText ? "Edit Text" : "Create New Text"}
            </h2>
            <form onSubmit={handleSubmit} className="mb-8">
                {/* Red Marquee Section */}
                <h3 className="text-xl font-semibold mb-2">Red Marquee Items</h3>
                {formData.redMarquee.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <input
                            type="text"
                            placeholder="Text"
                            value={item.text}
                            onChange={(e) => handleMarqueeChange("redMarquee", index, "text", e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Icon (e.g., FaClock)"
                            value={item.icon}
                            onChange={(e) => handleMarqueeChange("redMarquee", index, "icon", e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteMarqueeItem("redMarquee", index)}
                            className="bg-red-500 text-white p-1 rounded"
                        >
                            Delete Item
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addMarqueeItem("redMarquee")}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                    Add Red Marquee Item
                </button>

                {/* Black Marquee Section */}
                <h3 className="text-xl font-semibold mb-2 mt-4">Black Marquee Items</h3>
                {formData.blackMarquee.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border rounded">
                        <input
                            type="text"
                            placeholder="Text"
                            value={item.text}
                            onChange={(e) => handleMarqueeChange("blackMarquee", index, "text", e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Icon (e.g., FaClock)"
                            value={item.icon}
                            onChange={(e) => handleMarqueeChange("blackMarquee", index, "icon", e.target.value)}
                            className="w-full p-2 mb-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteMarqueeItem("blackMarquee", index)}
                            className="bg-red-500 text-white p-1 rounded"
                        >
                            Delete Item
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addMarqueeItem("blackMarquee")}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                    Add Black Marquee Item
                </button>

                <div className="flex gap-2 mt-4">
                    {currentText && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-green-500 text-white p-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {isLoading ? "Saving..." : currentText ? "Update" : "Create"} Text
                    </button>
                </div>
            </form>

            {/* Text List */}
            <h2 className="text-xl font-semibold mb-2">Existing Texts</h2>
            {isLoading ? (
                <div className="text-center py-4">Loading...</div>
            ) : texts.length === 0 ? (
                <p>No texts found.</p>
            ) : (
                <ul className="space-y-2">
                    {texts.map((text) => (
                        <li key={text._id} className="flex justify-between p-2 border rounded">
                            <div>
                                <h4 className="font-semibold">Red Marquee Items:</h4>
                                <ul className="ml-4">
                                    {text.redMarquee.map((item, index) => (
                                        <li key={index}>{item.text} ({item.icon})</li>
                                    ))}
                                </ul>
                                <h4 className="font-semibold mt-2">Black Marquee Items:</h4>
                                <ul className="ml-4">
                                    {text.blackMarquee.map((item, index) => (
                                        <li key={index}>{item.text} ({item.icon})</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEdit(text)}
                                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(text._id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnimatedTextManager; 