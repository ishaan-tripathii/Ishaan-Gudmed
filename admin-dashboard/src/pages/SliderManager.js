"use client"

import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import { ToastContainer, toast } from "react-toastify"
import { Trash2, Edit, RefreshCw, PlusCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PageForm from "./PageForm"
import { useApi } from "../hooks/useApi"

// Initialize Socket.IO connection
const socket = io("http://localhost:5000", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
})

const SliderManager = () => {
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const [deleteId, setDeleteId] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [pageToEdit, setPageToEdit] = useState(null)
    const api = useApi()

    // Fetch all pages
    const fetchPages = async () => {
        try {
            const data = await api.get('/pages')
            console.log("Fetched pages:", data)
            setPages(data || [])
            setLoading(false)
        } catch (error) {
            console.error("Error in fetchPages:", error)
            setMessage(error.response?.data?.message || "Error fetching pages")
            setMessageType("error")
            toast.error(error.response?.data?.message || "Error fetching pages")
            setLoading(false)
        }
    }

    // Delete a page
    const handleDelete = async (id) => {
        try {
            await api.delete(`/pages/${id}`)
            setMessage("Page deleted successfully")
            setMessageType("success")
            toast.success("Page deleted successfully")
            fetchPages()
            setDeleteId(null)
        } catch (error) {
            console.error("Error in handleDelete:", error)
            setMessage(error.response?.data?.message || "Error deleting page")
            setMessageType("error")
            toast.error(error.response?.data?.message || "Error deleting page")
        }
    }

    // Open form for creating a new slide
    const handleOpenCreateForm = () => {
        setPageToEdit(null)
        setIsFormOpen(true)
    }

    // Open form for editing an existing slide
    const handleOpenEditForm = (page) => {
        setPageToEdit(page)
        setIsFormOpen(true)
    }

    // Close the form
    const handleCloseForm = () => {
        setIsFormOpen(false)
        setPageToEdit(null)
        fetchPages() // Refresh the list after form submission
    }

    // Fetch pages on mount and setup socket
    useEffect(() => {
        fetchPages()

        socket.on("connect", () => {
            console.log("Connected to Socket.IO server")
        })

        socket.on("contentUpdated", () => {
            fetchPages()
            setMessage("Content updated in real-time")
            setMessageType("success")
            setTimeout(() => setMessage(""), 3000)
        })

        socket.on("disconnect", () => {
            console.log("Disconnected from Socket.IO server")
        })

        return () => {
            socket.off("contentUpdated")
            socket.off("connect")
            socket.off("disconnect")
        }
    }, [])

    // Clear message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 5000)
            return () => clearTimeout(timer)
        }
    }, [message])

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Slider Manager</h1>
                <div className="flex gap-2">
                    <button
                        onClick={fetchPages}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    <button
                        onClick={handleOpenCreateForm}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <PlusCircle className="h-4 w-4" /> New Slide
                    </button>
                </div>
            </div>

            {/* Message Display */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 mb-6 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                            }`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pages List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : pages.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No slides found. Create your first slide!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {pages.map((page) => (
                            <motion.div
                                key={page._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-lg shadow overflow-hidden"
                            >
                                <div className={`p-4 text-white ${page.gradient}`}>
                                    <h3 className="text-xl font-bold whitespace-pre-line">{page.titleDesktop}</h3>
                                    <p className="text-sm">/{page.slug}</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 whitespace-pre-line">Mobile: {page.titleMobile}</p>
                                    {page.gradientWords?.length > 0 && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            Gradient Words: {page.gradientWords.join(", ")}
                                        </p>
                                    )}
                                    {page.benefits?.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits:</h4>
                                            <ul className="space-y-2">
                                                {page.benefits.map((benefit, i) => (
                                                    <li key={benefit._id || i} className="text-sm text-gray-600">
                                                        <strong>{benefit.heading}:</strong> {benefit.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => handleOpenEditForm(page)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(page._id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this slide?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Page Form Modal */}
            {isFormOpen && (
                <PageForm pageToEdit={pageToEdit} onClose={handleCloseForm} isOpen={isFormOpen} />
            )}
        </div>
    )
}

export default SliderManager 