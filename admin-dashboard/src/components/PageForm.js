"use client"

import React, { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import useApi from "../hooks/useApi"
import Button from "./common/Button"
import Modal from "./common/Modal"

const gradientOptions = [
  { value: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500", label: "Purple to Red" },
  { value: "bg-gradient-to-r from-blue-400 via-teal-500 to-green-500", label: "Blue to Green" },
  { value: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500", label: "Yellow to Red" },
  { value: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500", label: "Indigo to Pink" },
  { value: "bg-gradient-to-r from-green-400 via-teal-500 to-blue-500", label: "Green to Blue" },
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

      if (pageToEdit) {
        await put(`/pages/${pageToEdit._id}`, data)
        setMessage("Page updated successfully")
      } else {
        await post("/pages", data)
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
      title={pageToEdit ? "Edit Slide" : "Create New Slide"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Desktop Title">
            <textarea
              value={formData.titleDesktop}
              onChange={(e) => handleChange("titleDesktop", e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </FormField>

          <FormField label="Mobile Title">
            <textarea
              value={formData.titleMobile}
              onChange={(e) => handleChange("titleMobile", e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </FormField>
        </div>

        <FormField label="Gradient Words">
          <input
            type="text"
            value={formData.gradientWords}
            onChange={(e) => handleChange("gradientWords", e.target.value)}
            placeholder="word1, word2, word3"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </FormField>

        <FormField label="Gradient Style">
          <select
            value={formData.gradient}
            onChange={(e) => handleChange("gradient", e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {gradientOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className={`h-6 mt-2 rounded ${formData.gradient}`} />
        </FormField>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Benefits</label>
            <Button
              variant="icon"
              icon={<PlusCircle className="h-4 w-4" />}
              onClick={addBenefit}
              className="text-indigo-600 hover:bg-indigo-100"
            >
              Add
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
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </FormField>

        {message && (
          <div
            className={`text-sm p-2 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {pageToEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PageForm

