import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom"; // Use NavLink for active styling

const HospitalPageManager = () => {
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
        <h1 className="text-3xl font-bold">Manage Hospital Page</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p className="text-lg mb-4">Welcome, Admin</p>
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NavLink
          to="/admin/hospital/manage"
          className={({ isActive }) =>
            `p-4 rounded-lg text-center ${isActive ? 'bg-blue-300' : 'bg-blue-100'} hover:bg-blue-200`
          }
        >
          <h2 className="text-xl font-semibold text-blue-600">Manage Hospital Data</h2>
        </NavLink>
        <NavLink
          to="/admin/hospital/icu"
          className={({ isActive }) =>
            `p-4 rounded-lg text-center ${isActive ? 'bg-blue-300' : 'bg-blue-100'} hover:bg-blue-200`
          }
        >
          <h2 className="text-xl font-semibold text-blue-600">ICU data </h2>
        </NavLink>
        <NavLink
          to="/admin/hospital/smart-care"
          className={({ isActive }) =>
            `p-4 rounded-lg text-center ${isActive ? 'bg-blue-300' : 'bg-blue-100'} hover:bg-blue-200`
          }
        >
          <h2 className="text-xl font-semibold text-blue-600">Smart Care  </h2>
        </NavLink>
        <NavLink
          to="/admin/hospital/mrd"
          className={({ isActive }) =>
            `p-4 rounded-lg text-center ${isActive ? 'bg-blue-300' : 'bg-blue-100'} hover:bg-blue-200`
          }
        >
          <h2 className="text-xl font-semibold text-blue-600">Mrd  </h2>
        </NavLink>
        <p>Hi, kaise hai aap?</p> {/* Fixed typo */}
      </nav>
    </div>
  );
};

export default HospitalPageManager;