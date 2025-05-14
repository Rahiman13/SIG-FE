import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import EmployeesPage from './components/EmployeesPage';
import CardsPage from './components/CardsPage';
import CardDetailsPage from './components/CardDetails';
import QuickLinksPage from './components/QuickLinksPage';
import TicketsPage from './components/TicketsPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
            <Route path="/cards/:id" element={<CardDetailsPage />} />
            <Route path="/quick-links" element={<QuickLinksPage />} />
            <Route path="/tickets" element={<TicketsPage />} />

            {/* <Route path="/employees" element={<EmployeesPage />} /> */}
          </Route>

          {/* Redirect root to login or welcome based on auth status */}
          <Route path="/" element={
            localStorage.getItem('token')
              ? <Navigate to="/welcome" replace />
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
