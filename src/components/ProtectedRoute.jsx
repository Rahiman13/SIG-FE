import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const isLoginPage = window.location.pathname === '/login';
  const isForgotPasswordPage = window.location.pathname === '/forgot-password';
  const isPublicRoute = isLoginPage || isForgotPasswordPage;

  // If trying to access public pages while authenticated, redirect to welcome page
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/welcome" replace />;
  }

  // If trying to access protected route while not authenticated, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;