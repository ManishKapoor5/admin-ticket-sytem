"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import ClientLogin from "./components/ClientLogin"
import Dashboard from "./components/Dashboard"
import ClientPortal from "./components/ClientPortal"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import "./App.css"

// Protected Route component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect clients to client portal, others to admin dashboard
    if (user.role === "client") {
      return <Navigate to="/client-portal" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

// Public Route component (redirects to appropriate dashboard if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (user) {
    // Redirect based on user role
    if (user.role === "client") {
      return <Navigate to="/client-portal" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Admin/Staff Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Client Login */}
        <Route
          path="/client-login"
          element={
            <PublicRoute>
              <ClientLogin />
            </PublicRoute>
          }
        />

        {/* Admin/Staff Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "developer", "client_management"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Client Portal */}
        <Route
          path="/client-portal"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/client" element={<Navigate to="/client-login" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
