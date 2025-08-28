import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContent from './AppContent';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
