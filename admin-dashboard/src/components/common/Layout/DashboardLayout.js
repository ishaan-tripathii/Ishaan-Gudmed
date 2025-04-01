import React from 'react';
import { motion } from 'framer-motion';
import { Home, Settings, Users, BarChart, Bell } from 'lucide-react';

const Sidebar = () => (
  <div className="hidden md:flex flex-col w-64 bg-indigo-800 text-white p-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
    </div>
    <nav className="space-y-2">
      {[
        { icon: Home, label: 'Dashboard' },
        { icon: BarChart, label: 'Analytics' },
        { icon: Users, label: 'Users' },
        { icon: Settings, label: 'Settings' },
      ].map(({ icon: Icon, label }) => (
        <a
          key={label}
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  </div>
);

const Header = () => (
  <header className="bg-white shadow-sm">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="md:hidden">
        <button className="text-gray-500 hover:text-gray-600">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500 hover:text-gray-600">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            A
          </div>
          <span className="text-gray-700">Admin</span>
        </div>
      </div>
    </div>
  </header>
);

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout; 