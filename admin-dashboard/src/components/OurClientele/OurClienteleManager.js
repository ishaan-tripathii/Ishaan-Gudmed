import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import pagesService from "../../services/api/pagesService";
import { useRealtimeUpdates } from "../../hooks/useRealtimeUpdates";

const OurClienteleManager = () => {
    const [clienteles, setClienteles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentClientele, setCurrentClientele] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
    });

    // Fetch clienteles from the server
    const fetchClienteles = async () => {
        try {
            setIsLoading(true);
            const response = await pagesService.getOurClienteleList();
            setClienteles(response?.data || []);
        } catch (err) {
            console.error("Error fetching clienteles:", err);
            toast.error("Failed to load clienteles");
        } finally {
            setIsLoading(false);
        }
    };

    // Setup real-time updates
    const { emitEvent } = useRealtimeUpdates('clientele', (eventType, data) => {
        switch (eventType) {
            case 'create':
                setClienteles(prev => [...prev, data]);
                toast.success('New clientele created in real-time!');
                break;
            case 'update':
                setClienteles(prev => prev.map(clientele =>
                    clientele._id === data._id ? data : clientele
                ));
                toast.success('Clientele updated in real-time!');
                break;
            case 'delete':
                setClienteles(prev => prev.filter(clientele => clientele._id !== data._id));
                toast.success('Clientele deleted in real-time!');
                break;
        }
    });

    useEffect(() => {
        fetchClienteles();
    }, []);

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            image: "",
        });
        setCurrentClientele(null);
    };

    // Handle edit button click
    const handleEdit = (clientele) => {
        setCurrentClientele(clientele);
        setFormData({
            title: clientele.title || "",
            description: clientele.description || "",
            image: clientele.image || "",
        });
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this clientele?")) return;
        try {
            await pagesService.deleteOurClientele(id);
            emitEvent('delete', { _id: id });
            toast.success("Clientele deleted successfully");
        } catch (err) {
            toast.error("Failed to delete clientele");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let response;
            if (currentClientele) {
                response = await pagesService.updateOurClientele(currentClientele._id, formData);
                emitEvent('update', response.data);
                toast.success("Clientele updated successfully");
            } else {
                response = await pagesService.createOurClientele(formData);
                emitEvent('create', response.data);
                toast.success("Clientele created successfully");
            }
            resetForm();
        } catch (err) {
            toast.error("Failed to save clientele");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Our Clientele Manager</h1>
            <ToastContainer />

            {/* Form Section */}
            <h2 className="text-2xl font-semibold mb-4">
                {currentClientele ? "Edit Clientele" : "Create New Clientele"}
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
                    {currentClientele && (
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
                        {isLoading ? "Saving..." : currentClientele ? "Update" : "Create"} Clientele
                    </button>
                </div>
            </form>

            {/* Clientele List */}
            <h2 className="text-xl font-semibold mb-2">Existing Clienteles</h2>
            {isLoading ? (
                <div className="text-center py-4">Loading...</div>
            ) : clienteles.length === 0 ? (
                <p>No clienteles found.</p>
            ) : (
                <ul className="space-y-2">
                    {clienteles.map((clientele) => (
                        <li key={clientele._id} className="flex justify-between p-2 border rounded">
                            <div>
                                <h4 className="font-semibold">{clientele.title}</h4>
                                <p className="text-gray-600">{clientele.description}</p>
                                <img
                                    src={clientele.image}
                                    alt={clientele.title}
                                    className="w-24 h-24 object-cover mt-2"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEdit(clientele)}
                                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(clientele._id)}
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

export default OurClienteleManager; 