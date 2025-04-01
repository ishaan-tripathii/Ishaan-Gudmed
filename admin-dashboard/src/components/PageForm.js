"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Trash2 } from "lucide-react"
import useApi from "../hooks/useApi"
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates'
import Button from "./common/Button"
import Modal from "./common/Modal"

const gradientOptions = [
  { label: "Blue to Purple", value: "bg-gradient-to-r from-blue-500 to-purple-500" },
  { label: "Green to Blue", value: "bg-gradient-to-r from-green-500 to-blue-500" },
  { label: "Red to Orange", value: "bg-gradient-to-r from-red-500 to-orange-500" },
  { label: "Purple to Pink", value: "bg-gradient-to-r from-purple-500 to-pink-500" },
]

const FormField = ({ label, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
)

const BenefitField = ({ benefit, index, onChange, onRemove }) => (
  <div className="grid gap-2 sm:grid-cols-2 mb-2 p-2 bg-gray-50 rounded">
    <input
      type="text"
      value={benefit.heading}
      onChange={(e) => onChange(index, "heading", e.target.value)}
      placeholder="Heading"
      className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
    <div className="flex gap-2">
      <input
        type="text"
        value={benefit.description}
        onChange={(e) => onChange(index, "description", e.target.value)}
        placeholder="Description"
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 flex-1"
      />
      <Button
        variant="icon"
        icon={<Trash2 className="h-5 w-5" />}
        onClick={() => onRemove(index)}
        className="text-red-600 hover:bg-red-100"
      />
    </div>
  </div>
)

const PageForm = ({ pageToEdit, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    titleDesktop: pageToEdit?.titleDesktop || "",
    titleMobile: pageToEdit?.titleMobile || "",
    gradientWords: pageToEdit?.gradientWords?.join(", ") || "",
    gradient: pageToEdit?.gradient || gradientOptions[0].value,
    benefits: pageToEdit?.benefits || [{ heading: "", description: "" }],
    slug: pageToEdit?.slug || "",
  })

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")

  const { post, put } = useApi()
  const { emitEvent } = useRealtimeUpdates('slider')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index][field] = value
    handleChange("benefits", newBenefits)
  }

  const addBenefit = () => {
    handleChange("benefits", [...formData.benefits, { heading: "", description: "" }])
  }

  const removeBenefit = (index) => {
    handleChange(
      "benefits",
      formData.benefits.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        gradientWords: formData.gradientWords ? formData.gradientWords.split(",").map((word) => word.trim()) : [],
        benefits: formData.benefits.filter((b) => b.heading && b.description),
      }

      let response
      if (pageToEdit) {
        response = await put(`/pages/${pageToEdit._id}`, data)
        emitEvent('update', response.data)
        setMessage("Page updated successfully")
      } else {
        response = await post("/pages", data)
        emitEvent('create', response.data)
        setMessage("Page created successfully")
        setFormData({
          titleDesktop: "",
          titleMobile: "",
          gradientWords: "",
          gradient: gradientOptions[0].value,
          benefits: [{ heading: "", description: "" }],
          slug: "",
        })
      }

      setMessageType("success")
      setTimeout(() => onClose(), 2000)
    } catch (error) {
      setMessageType("error")
      setMessage(`Error ${pageToEdit ? "updating" : "creating"} page`)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pageToEdit ? "Edit Slide" : "New Slide"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Desktop Title">
            <input
              type="text"
              value={formData.titleDesktop}
              onChange={(e) => handleChange("titleDesktop", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </FormField>

          <FormField label="Mobile Title">
            <input
              type="text"
              value={formData.titleMobile}
              onChange={(e) => handleChange("titleMobile", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </FormField>
        </div>

        <FormField label="Gradient Words">
          <input
            type="text"
            value={formData.gradientWords}
            onChange={(e) => handleChange("gradientWords", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </FormField>

        <FormField label="Gradient Style">
          <select
            value={formData.gradient}
            onChange={(e) => handleChange("gradient", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {gradientOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Benefits</label>
            <Button
              type="button"
              variant="secondary"
              onClick={addBenefit}
              className="text-sm"
            >
              Add Benefit
            </Button>
          </div>
          {formData.benefits.map((benefit, index) => (
            <BenefitField
              key={index}
              benefit={benefit}
              index={index}
              onChange={handleBenefitChange}
              onRemove={removeBenefit}
            />
          ))}
        </div>

        <FormField label="Slug">
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </FormField>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${messageType === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
              }`}
          >
            {message}
          </motion.div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {pageToEdit ? "Update" : "Create"} Slide
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PageForm

