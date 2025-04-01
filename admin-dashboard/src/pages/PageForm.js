"use client"

import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { PlusCircle, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApi } from "../hooks/useApi"

const PageForm = ({ pageToEdit, onClose, isOpen }) => {
    const [titleDesktop, setTitleDesktop] = useState(pageToEdit?.titleDesktop || "")
    const [titleMobile, setTitleMobile] = useState(pageToEdit?.titleMobile || "")
    const [gradientWords, setGradientWords] = useState(pageToEdit?.gradientWords?.join(", ") || "")
    const [gradient, setGradient] = useState(
        pageToEdit?.gradient || "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    )
    const [benefits, setBenefits] = useState(pageToEdit?.benefits || [{ heading: "", description: "" }])
    const [slug, setSlug] = useState(pageToEdit?.slug || "")
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const api = useApi()

    const gradientOptions = [
        { value: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500", label: "Purple to Red" },
        { value: "bg-gradient-to-r from-blue-400 via-teal-500 to-green-500", label: "Blue to Green" },
        { value: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500", label: "Yellow to Red" },
        { value: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500", label: "Indigo to Pink" },
        { value: "bg-gradient-to-r from-green-400 via-teal-500 to-blue-500", label: "Green to Blue" },
    ]

    const handleBenefitChange = (index, field, value) => {
        const newBenefits = [...benefits]
        newBenefits[index][field] = value
        setBenefits(newBenefits)
    }

    const addBenefit = () => setBenefits([...benefits, { heading: "", description: "" }])
    const removeBenefit = (index) => setBenefits(benefits.filter((_, i) => i !== index))

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = {
                titleDesktop,
                titleMobile,
                gradientWords: gradientWords ? gradientWords.split(",").map((word) => word.trim()) : [],
                gradient,
                benefits: benefits.filter((b) => b.heading && b.description),
                slug,
            }

            console.log("Submitting data:", data)

            const endpoint = pageToEdit ? `/pages/${pageToEdit._id}` : '/pages'
            const method = pageToEdit ? "put" : "post"

            const response = await api[method](endpoint, data)
            console.log("API Response:", response)

            setMessageType("success")
            setMessage(pageToEdit ? "Page updated successfully" : "Page created successfully")
            toast.success(pageToEdit ? "Page updated successfully" : "Page created successfully")

            if (!pageToEdit) {
                setTitleDesktop("")
                setTitleMobile("")
                setGradientWords("")
                setGradient("bg-gradient-to-r from-purple-400 via-pink-500 to-red-500")
                setBenefits([{ heading: "", description: "" }])
                setSlug("")
            }
            setTimeout(() => onClose(), 2000)
        } catch (error) {
            console.error("Error in handleSubmit:", error)
            setMessageType("error")
            setMessage(error.response?.data?.message || `Error ${pageToEdit ? "updating" : "creating"} page`)
            toast.error(error.response?.data?.message || `Error ${pageToEdit ? "updating" : "creating"} page`)
        }
    }

    const handleCancel = (e) => {
        e.preventDefault()
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            {pageToEdit ? "Edit Slide" : "Create New Slide"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Desktop Title</label>
                                    <textarea
                                        value={titleDesktop}
                                        onChange={(e) => setTitleDesktop(e.target.value)}
                                        required
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        rows="3"
                                        placeholder="Enter desktop title (supports line breaks)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile Title</label>
                                    <textarea
                                        value={titleMobile}
                                        onChange={(e) => setTitleMobile(e.target.value)}
                                        required
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        rows="3"
                                        placeholder="Enter mobile title (supports line breaks)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gradient Words</label>
                                <input
                                    type="text"
                                    value={gradientWords}
                                    onChange={(e) => setGradientWords(e.target.value)}
                                    placeholder="word1, word2, word3"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Separate words with commas</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gradient Style</label>
                                <select
                                    value={gradient}
                                    onChange={(e) => setGradient(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {gradientOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={`h-6 mt-2 rounded ${gradient}`}></div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Benefits</label>
                                    <button
                                        type="button"
                                        onClick={addBenefit}
                                        className="flex items-center text-indigo-600 hover:text-indigo-800"
                                    >
                                        <PlusCircle className="h-4 w-4 mr-1" /> Add
                                    </button>
                                </div>
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="grid gap-2 sm:grid-cols-2 mb-2 p-2 bg-gray-50 rounded">
                                        <input
                                            type="text"
                                            value={benefit.heading}
                                            onChange={(e) => handleBenefitChange(index, "heading", e.target.value)}
                                            placeholder="Heading"
                                            className="p-2 border rounded-lg"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={benefit.description}
                                                onChange={(e) => handleBenefitChange(index, "description", e.target.value)}
                                                placeholder="Description"
                                                className="p-2 border rounded-lg flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeBenefit(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                    placeholder="Enter URL-friendly slug (e.g., slide-1)"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {message && (
                                <p
                                    className={`text-sm p-2 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {message}
                                </p>
                            )}

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    {pageToEdit ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default PageForm 