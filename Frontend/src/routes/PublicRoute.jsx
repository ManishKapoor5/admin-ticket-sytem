// routes/PublicRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Show loading spinner instead of null to prevent flicker
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Fix route names to match App.js
  if (user) {
    if (user.role === "client") return <Navigate to="/client-portal" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute