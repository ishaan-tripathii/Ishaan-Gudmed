// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const AdminTechnologyList = () => {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPages = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('Please log in to view pages.');
//         const response = await axios.get('http://localhost:5000/api/technology', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPages(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch pages');
//         console.error('Error fetching pages:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPages();
//   }, []);

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center py-12">{error}</div>;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Manage Technology Pages</h1>
//       <Link to="/admin/technology/new">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4">
//           Create New Page
//         </button>
//       </Link>
//       {pages.length === 0 ? (
//         <p>No technology pages found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {pages.map((page) => (
//             <li key={page._id} className="p-4 border border-gray-200 rounded-md">
//               <h2 className="text-lg font-semibold">{page.title}</h2>
//               <p className="text-gray-600">Slug: {page.slug}</p>
//               <Link to={`/admin/technology/${page._id}`}>
//                 <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mt-2">
//                   Edit
//                 </button>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AdminTechnologyList;