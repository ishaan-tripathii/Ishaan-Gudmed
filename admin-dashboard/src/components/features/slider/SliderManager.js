import React, { useState, useEffect } from "react";
import { RefreshCw, Edit, Trash2, PlusCircle, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import useSocket from "../../../hooks/useSocket";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import Card from "../../common/Card";
import DashboardLayout from "../../common/Layout/DashboardLayout";
import PageForm from "./PageForm";
import { pagesService } from "../../../services/api/pagesService";

const SliderManager = () => {
    const [pages, setPages] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [pageToEdit, setPageToEdit] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { socket } = useSocket({
        contentUpdated: () => {
            fetchPages();
            setMessage("Content updated in real-time");
            setMessageType("success");
        }
    });

    const fetchPages = async () => {
        try {
            setIsLoading(true);
            const data = await pagesService.getPages();
            setPages(data);
        } catch (error) {
            setMessage("Error fetching pages");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await pagesService.deletePage(id);
            setMessage("Page deleted successfully");
            setMessageType("success");
            fetchPages();
            setDeleteId(null);
        } catch (error) {
            setMessage("Error deleting page");
            setMessageType("error");
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const filteredPages = pages.filter(page =>
        page.titleDesktop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.titleMobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderPageCard = (page) => (
        <Card
            key={page._id}
            gradient={page.gradient}
            hoverable
            header={
                <div>
                    <h3 className="text-xl font-bold">{page.titleDesktop}</h3>
                    <p className="text-sm opacity-80">/{page.slug}</p>
                </div>
            }
            actions={
                <div className="flex gap-2">
                    <Button
                        variant="icon"
                        icon={<Edit className="h-5 w-5" />}
                        onClick={() => {
                            setPageToEdit(page);
                            setIsFormOpen(true);
                        }}
                        className="text-indigo-600 hover:bg-indigo-50"
                    />
                    <Button
                        variant="icon"
                        icon={<Trash2 className="h-5 w-5" />}
                        onClick={() => setDeleteId(page._id)}
                        className="text-red-600 hover:bg-red-50"
                    />
                </div>
            }
        >
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-500">Mobile Title</h4>
                    <p className="text-gray-700">{page.titleMobile}</p>
                </div>

                {page.gradientWords.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Gradient Words</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {page.gradientWords.map((word, index) => (
                                <span
                                    key={index}
                                    className={`px-2 py-1 rounded-full text-sm text-white ${page.gradient}`}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {page.benefits.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Benefits</h4>
                        <ul className="mt-2 space-y-2">
                            {page.benefits.map((benefit, i) => (
                                <li key={i} className="text-sm">
                                    <span className="font-medium">{benefit.heading}:</span>{" "}
                                    <span className="text-gray-600">{benefit.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Slider Manager</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            icon={<RefreshCw className="h-4 w-4" />}
                            onClick={fetchPages}
                            isLoading={isLoading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="primary"
                            icon={<PlusCircle className="h-4 w-4" />}
                            onClick={() => {
                                setPageToEdit(null);
                                setIsFormOpen(true);
                            }}
                        >
                            New Slide
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search slides..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <AnimatePresence>
                    {message && (
                        <div
                            className={`p-4 rounded-lg ${messageType === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {message}
                        </div>
                    )}
                </AnimatePresence>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <Card key={n} isLoading />
                        ))}
                    </div>
                ) : filteredPages.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? "No slides match your search" : "No slides found. Create your first slide!"}
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredPages.map(renderPageCard)}
                        </AnimatePresence>
                    </div>
                )}

                <Modal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    title="Confirm Deletion"
                >
                    <p className="mb-6">Are you sure you want to delete this slide? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(deleteId)}
                            icon={<Trash2 className="h-4 w-4" />}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal>

                <PageForm
                    pageToEdit={pageToEdit}
                    onClose={() => {
                        setIsFormOpen(false);
                        setPageToEdit(null);
                        fetchPages();
                    }}
                    isOpen={isFormOpen}
                />
            </div>
        </DashboardLayout>
    );
};

export default SliderManager; 