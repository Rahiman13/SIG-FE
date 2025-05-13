import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import EmployeesPage from './components/EmployeesPage';
import CardsPage from './components/CardsPage';
// import QuickLinksPage from './components/QuickLinksPage';
// import TicketsPage from './components/TicketsPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <ProtectedRoute>
            <LoginPage />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute>
            <ForgotPasswordPage />
          </ProtectedRoute>
        } />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/cards" element={<CardsPage />} />
          {/* <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/quick-links" element={<QuickLinksPage />} />
          <Route path="/tickets" element={<TicketsPage />} /> */}
        </Route>

        {/* Redirect root to login or welcome based on auth status */}
        <Route path="/" element={
          localStorage.getItem('token') 
            ? <Navigate to="/welcome" replace /> 
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
