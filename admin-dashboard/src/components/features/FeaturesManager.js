// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import pagesService from "../../services/api/pagesService";
// import { useRealtimeUpdates } from "../../hooks/useRealtimeUpdates";

// const FeaturesManager = () => {
//     const [features, setFeatures] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentFeature, setCurrentFeature] = useState(null);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         features: [{ title: "", description: "", icon: "" }],
//     });

//     // Fetch features from the server
//     const fetchFeatures = async () => {
//         try {
//             setIsLoading(true);
//             const response = await pagesService.getFeaturesList();
//             setFeatures(response?.data || []);
//         } catch (err) {
//             console.error("Error fetching features:", err);
//             toast.error("Failed to load features");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Setup real-time updates
//     const { emitEvent } = useRealtimeUpdates('features', (eventType, data) => {
//         switch (eventType) {
//             case 'create':
//                 setFeatures(prev => [...prev, data]);
//                 toast.success('New feature created in real-time!');
//                 break;
//             case 'update':
//                 setFeatures(prev => prev.map(feature =>
//                     feature._id === data._id ? data : feature
//                 ));
//                 toast.success('Feature updated in real-time!');
//                 break;
//             case 'delete':
//                 setFeatures(prev => prev.filter(feature => feature._id !== data._id));
//                 toast.success('Feature deleted in real-time!');
//                 break;
//         }
//     });

//     useEffect(() => {
//         fetchFeatures();
//     }, []);

//     // Reset form to initial state
//     const resetForm = () => {
//         setFormData({
//             title: "",
//             description: "",
//             features: [{ title: "", description: "", icon: "" }],
//         });
//         setCurrentFeature(null);
//     };

//     // Handle edit button click
//     const handleEdit = (feature) => {
//         setCurrentFeature(feature);
//         setFormData({
//             title: feature.title || "",
//             description: feature.description || "",
//             features: feature.features || [{ title: "", description: "", icon: "" }],
//         });
//     };

//     // Handle delete button click
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this feature?")) return;
//         try {
//             await pagesService.deleteFeatures(id);
//             emitEvent('delete', { _id: id });
//             toast.success("Feature deleted successfully");
//         } catch (err) {
//             toast.error("Failed to delete feature");
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             let response;
//             if (currentFeature) {
//                 response = await pagesService.updateFeatures(currentFeature._id, formData);
//                 emitEvent('update', response.data);
//                 toast.success("Feature updated successfully");
//             } else {
//                 response = await pagesService.createFeatures(formData);
//                 emitEvent('create', response.data);
//                 toast.success("Feature created successfully");
//             }
//             resetForm();
//         } catch (err) {
//             toast.error("Failed to save feature");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Feature handlers
//     const addFeature = () => {
//         setFormData({
//             ...formData,
//             features: [...formData.features, { title: "", description: "", icon: "" }],
//         });
//     };

//     const handleFeatureChange = (index, field, value) => {
//         const updatedFeatures = formData.features.map((feature, i) =>
//             i === index ? { ...feature, [field]: value } : feature
//         );
//         setFormData({ ...formData, features: updatedFeatures });
//     };

//     const handleDeleteFeature = (index) => {
//         if (!window.confirm("Are you sure you want to delete this feature?")) return;
//         const updatedFeatures = formData.features.filter((_, i) => i !== index);
//         setFormData({ ...formData, features: updatedFeatures });
//     };

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6">Features Manager</h1>
//             <ToastContainer />

//             {/* Form Section */}
//             <h2 className="text-2xl font-semibold mb-4">
//                 {currentFeature ? "Edit Feature" : "Create New Feature"}
//             </h2>
//             <form onSubmit={handleSubmit} className="mb-8">
//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         placeholder="Title"
//                         value={formData.title}
//                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <textarea
//                         placeholder="Description"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>

//                 <h3 className="text-xl font-semibold mb-2">Features</h3>
//                 {formData.features.map((feature, index) => (
//                     <div key={index} className="mb-4 p-4 border rounded">
//                         <input
//                             type="text"
//                             placeholder="Feature Title"
//                             value={feature.title}
//                             onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
//                             className="w-full p-2 mb-2 border rounded"
//                         />
//                         <textarea
//                             placeholder="Feature Description"
//                             value={feature.description}
//                             onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
//                             className="w-full p-2 mb-2 border rounded"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Icon (e.g., FaStar)"
//                             value={feature.icon}
//                             onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
//                             className="w-full p-2 mb-2 border rounded"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => handleDeleteFeature(index)}
//                             className="bg-red-500 text-white p-1 rounded"
//                         >
//                             Delete Feature
//                         </button>
//                     </div>
//                 ))}
//                 <button
//                     type="button"
//                     onClick={addFeature}
//                     className="bg-blue-500 text-white p-2 rounded mr-2"
//                 >
//                     Add Feature
//                 </button>

//                 <div className="flex gap-2 mt-4">
//                     {currentFeature && (
//                         <button
//                             type="button"
//                             onClick={resetForm}
//                             className="bg-gray-500 text-white p-2 rounded"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`bg-green-500 text-white p-2 rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""
//                             }`}
//                     >
//                         {isLoading ? "Saving..." : currentFeature ? "Update" : "Create"} Feature
//                     </button>
//                 </div>
//             </form>

//             {/* Feature List */}
//             <h2 className="text-xl font-semibold mb-2">Existing Features</h2>
//             {isLoading ? (
//                 <div className="text-center py-4">Loading...</div>
//             ) : features.length === 0 ? (
//                 <p>No features found.</p>
//             ) : (
//                 <ul className="space-y-2">
//                     {features.map((feature) => (
//                         <li key={feature._id} className="flex justify-between p-2 border rounded">
//                             <div>
//                                 <h4 className="font-semibold">{feature.title}</h4>
//                                 <p className="text-gray-600">{feature.description}</p>
//                                 <ul className="mt-2">
//                                     {feature.features.map((f, index) => (
//                                         <li key={index} className="ml-4">
//                                             {f.title} ({f.icon})
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div>
//                                 <button
//                                     onClick={() => handleEdit(feature)}
//                                     className="bg-yellow-500 text-white p-1 rounded mr-2"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(feature._id)}
//                                     className="bg-red-500 text-white p-1 rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default FeaturesManager; 