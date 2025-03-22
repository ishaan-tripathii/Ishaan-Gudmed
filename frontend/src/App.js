import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
    return (
        <div className="App">
            <Toaster position="top-center" />
            <Routes>
                <Route path="/" element={<div className="welcome">Welcome to Gudmed</div>} />
                <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default App; 