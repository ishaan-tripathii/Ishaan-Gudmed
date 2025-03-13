import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const HomePageManager = () => {
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
        <h1 className="text-3xl font-bold">Manage Home Page</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p className="text-lg mb-4">Welcome, {user.email}</p>
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/home/slider"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Slider</h2>
        </Link>
        <Link
          to="/admin/home/animated-text"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Animated Text</h2>
        </Link>
        <Link
          to="/admin/home/step-by-step"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Step By Step</h2>
        </Link>
        <Link
          to="/admin/home/image-comparison"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Image Comparison</h2>
        </Link>
        <Link
          to="/admin/home/counter-section"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Counter Section</h2>
        </Link>
        <Link
          to="/admin/home/technology-page"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Technology Page</h2>
        </Link>
        <Link
          to="/admin/home/ai-section"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">ai page</h2>
        </Link>

        <Link
          to="/admin/home/comparison-section"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Comparison Section</h2>
        </Link>
        <Link
          to="/admin/home/why-gudmed-unique"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Why Gudmed Unique</h2>
        </Link>
        <Link
          to="/admin/home/knowledge-partner-card-section"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Knowledge Partner Card</h2>
        </Link>
        <Link
          to="/admin/home/our-client"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Our Client</h2>
        </Link>
        <Link
          to="/admin/home/our-footer"
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 text-center"
        >
          <h2 className="text-xl font-semibold text-blue-600">Footer</h2>
        </Link>
      </nav>
    </div>
  );
};

export default HomePageManager;