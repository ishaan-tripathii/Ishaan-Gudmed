import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
    return (
        <div className="App">
            <Toaster position="top-center" />
            <Routes>
                {/* Add your routes here */}
            </Routes>
        </div>
    );
}

export default App; 