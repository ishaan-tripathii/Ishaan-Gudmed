import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import App from './App';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-right" // Position of the toast
      autoClose={3000}    // Auto-close after 3 seconds
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </BrowserRouter>,
  document.getElementById('root')
);