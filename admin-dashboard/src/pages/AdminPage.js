// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { socket } from "../socket";
// import { useAuth } from "../context/AuthContext";
// import { Trash2, Edit, RefreshCw, PlusCircle } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const AdminPage = () => {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const { token } = useAuth();

//   // Fetch all pages
//   const fetchPages = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:5000/api/pages");
//       setPages(response.data);
//       setLoading(false);
//     } catch (error) {
//       setMessage(error.response?.data.message || "Error fetching pages");
//       setMessageType("error");
//       setLoading(false);
//     }
//   };

//   // Delete a page
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/pages/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("Page deleted successfully");
//       setMessageType("success");
//       fetchPages();
//     } catch (error) {
//       setMessage(error.response?.data.message || "Error deleting page");
//       setMessageType("error");
//     }
//   };

//   // Fetch pages on mount and setup socket for real-time updates
//   useEffect(() => {
//     fetchPages();
//     socket.on("contentUpdated", fetchPages);
//     return () => socket.off("contentUpdated");
//   }, []);

//   return (
//     <div className="container mx-auto p-4 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard - Slides</h1>
//         <button
//           onClick={fetchPages}
//           className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//         >
//           <RefreshCw className="h-4 w-4" /> Refresh
//         </button>
//       </div>

//       <AnimatePresence>
//         {message && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`p-4 mb-6 rounded-lg ${
//               messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
//             }`}
//           >
//             {message}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : pages.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-6 text-center">
//           <p className="text-gray-500">No slides found. Create your first slide!</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {pages.map((page) => (
//             <div key={page._id} className="bg-white rounded-lg shadow p-4">
//               <h2 className="text-lg font-bold">{page.titleDesktop}</h2>
//               <button
//                 onClick={() => handleDelete(page._id)}
//                 className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPage;
import React from 'react'

const AdminPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdminPage
