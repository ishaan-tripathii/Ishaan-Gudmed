import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p className="text-lg mb-4">Welcome, {user.email}</p>
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/home" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600"> Home Page</h2>
        </Link>
        <Link to="/admin/about-us" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600"> About Us</h2>
        </Link>
        <Link to="/admin/doctors" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Doctors</h2>
        </Link>
        <Link to="/admin/hospital" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Hospital</h2>
        </Link>
        <Link to="/admin/patients" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600"> Patients</h2>
        </Link>
        <Link to="/admin/services" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Services</h2>
        </Link>
        <Link to="/admin/team" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600"> Team</h2>
        </Link>
        <Link to="/admin/footer" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center">
          <h2 className="text-xl font-semibold text-blue-600"> Footer</h2>
        </Link>
      </nav>
    </div>
  );
};

export default AdminHome;