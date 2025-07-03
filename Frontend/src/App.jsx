"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LoginPage from "./components/LoginPage"
import ClientLogin from "./components/ClientLogin"
import Dashboard from "./components/Dashboard"
import ClientPortal from "./components/ClientPortal"
import ClientSignup from "./components/ClientSignup"

import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import PublicRoute from "./routes/PublicRoute"

import "./App.css"

// Debug component to track renders and state changes
function FlickerDebug() {
  const { user, loading, error } = useAuth()
  const [renderCount, setRenderCount] = useState(0)
  const [stateHistory, setStateHistory] = useState([])
  
  useEffect(() => {
    setRenderCount(prev => prev + 1)
    
    // Track state changes
    const currentState = {
      loading,
      hasUser: !!user,
      userRole: user?.role || 'null',
      hasError: !!error,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setStateHistory(prev => [...prev.slice(-4), currentState])
  })
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '250px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <strong>🔍 Flicker Debug</strong>
      <div>Renders: {renderCount}</div>
      <div>Loading: {loading ? 'YES' : 'NO'}</div>
      <div>User: {user ? user.role : 'null'}</div>
      <div>Error: {error ? 'YES' : 'NO'}</div>
      <div>Current Time: {new Date().getSeconds()}s</div>
      
      <hr style={{margin: '5px 0', borderColor: '#666'}} />
      <strong>State History:</strong>
      {stateHistory.map((state, index) => (
        <div key={index} style={{fontSize: '10px', marginBottom: '2px'}}>
          {state.timestamp}: L:{state.loading ? 'Y' : 'N'} U:{state.userRole} E:{state.hasError ? 'Y' : 'N'}
        </div>
      ))}
      
      {renderCount > 10 && (
        <div style={{color: '#ff6b6b', marginTop: '5px'}}>
          ⚠️ Too many renders!
        </div>
      )}
    </div>
  )
}

// Protected Route for authenticated users with role check
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()

  // Debug: Log every render of ProtectedRoute
  console.log('ProtectedRoute render:', { user: user?.role, loading, allowedRoles })

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return user.role === "client"
      ? <Navigate to="/client-portal" replace />
      : <Navigate to="/dashboard" replace />
  }

  return children
}

// AppRoutes component
function AppRoutes() {
  // Debug: Log every render of AppRoutes
  console.log('AppRoutes render')
  
  return (
    <Router>
      <Routes>
        {/* Public Routes - restricted for logged-in users */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/client-login"
          element={
            <PublicRoute>
              <ClientLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <ClientSignup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "developer", "client_management"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-portal"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/client" element={<Navigate to="/client-login" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  )
}

// App Component
function App() {
  // Debug: Log every render of App
  console.log('App render')
  
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="App">
          <FlickerDebug />
          <AppRoutes />
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App