import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pagesService from "../../../services/api/pagesService";
import { useRealtimeUpdates } from "../../../hooks/useRealtimeUpdates";

const SliderManager = () => {
    const [sliders, setSliders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSlider, setCurrentSlider] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
    });

    // Fetch sliders from the server
    const fetchSliders = async () => {
        try {
            setIsLoading(true);
            const response = await pagesService.getSliderList();
            setSliders(response?.data || []);
        } catch (err) {
            console.error("Error fetching sliders:", err);
            toast.error("Failed to load sliders");
        } finally {
            setIsLoading(false);
        }
    };

    // Setup real-time updates
    const { emitEvent } = useRealtimeUpdates('slider', (eventType, data) => {
        switch (eventType) {
            case 'create':
                setSliders(prev => [...prev, data]);
                toast.success('New slider created in real-time!');
                break;
            case 'update':
                setSliders(prev => prev.map(slider =>
                    slider._id === data._id ? data : slider
                ));
                toast.success('Slider updated in real-time!');
                break;
            case 'delete':
                setSliders(prev => prev.filter(slider => slider._id !== data._id));
                toast.success('Slider deleted in real-time!');
                break;
        }
    });

    useEffect(() => {
        fetchSliders();
    }, []);

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            image: "",
        });
        setCurrentSlider(null);
    };

    // Handle edit button click
    const handleEdit = (slider) => {
        setCurrentSlider(slider);
        setFormData({
            title: slider.title || "",
            description: slider.description || "",
            image: slider.image || "",
        });
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slider?")) return;
        try {
            await pagesService.deleteSlider(id);
            emitEvent('delete', { _id: id });
            toast.success("Slider deleted successfully");
        } catch (err) {
            toast.error("Failed to delete slider");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (currentSlider) {
                response = await pagesService.updateSlider(currentSlider._id, formData);
                emitEvent('update', response.data);
                toast.success("Slider updated successfully");
            } else {
                response = await pagesService.createSlider(formData);
                emitEvent('create', response.data);
                toast.success("Slider created successfully");
            }
            resetForm();
        } catch (err) {
            toast.error("Failed to save slider");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Slider Manager</h1>
            <ToastContainer />

            {/* Form Section */}
            <h2 className="text-2xl font-semibold mb-4">
                {currentSlider ? "Edit Slider" : "Create New Slider"}
            </h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="flex gap-2">
                    {currentSlider && (
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
                        {isLoading ? "Saving..." : currentSlider ? "Update" : "Create"} Slider
                    </button>
                </div>
            </form>

            {/* Slider List */}
            <h2 className="text-xl font-semibold mb-2">Existing Sliders</h2>
            {isLoading ? (
                <div className="text-center py-4">Loading...</div>
            ) : sliders.length === 0 ? (
                <p>No sliders found.</p>
            ) : (
                <ul className="space-y-2">
                    {sliders.map((slider) => (
                        <li key={slider._id} className="flex justify-between p-2 border rounded">
                            <div>
                                <h4 className="font-semibold">{slider.title}</h4>
                                <p className="text-gray-600">{slider.description}</p>
                                <img
                                    src={slider.image}
                                    alt={slider.title}
                                    className="w-24 h-24 object-cover mt-2"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEdit(slider)}
                                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(slider._id)}
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

export default SliderManager; 