import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Shield, Users, Ticket, AlertCircle } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { adminAPI } from "../services/api"
import "./LoginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [demoUsers, setDemoUsers] = useState([])
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [demoLoadAttempted, setDemoLoadAttempted] = useState(false)
  
  // Single ref to track if component is mounted
  const mountedRef = useRef(true)

  const { login } = useAuth()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    mountedRef.current = true
    
    // Only attempt to load demo users once when component mounts
    const isDevelopment = process.env.NODE_ENV === "development" || 
                         process.env.REACT_APP_ENV === "development" ||
                         window.location.hostname === "localhost"
    
    if (isDevelopment && !demoLoadAttempted) {
      // Add delay to prevent immediate API call on mount
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          loadDemoUsers()
        }
      }, 300) // 300ms delay
      
      return () => clearTimeout(timer)
    }

    return () => {
      mountedRef.current = false
    }
  }, []) // Empty dependency array - only run once on mount

  const loadDemoUsers = async () => {
    // Prevent multiple calls
    if (demoLoadAttempted || !mountedRef.current) {
      return
    }

    setDemoLoadAttempted(true)
    setIsDemoLoading(true)

    try {
      const users = await adminAPI.getUsers()
      
      if (mountedRef.current) {
        const adminUsers = users
          .filter((user) => user.role === "admin" || user.role === "developer" || user.role === "client_management")
          .slice(0, 4)

        setDemoUsers(
          adminUsers.map((user) => ({
            email: user.email,
            name: user.username,
            role: user.role,
            level: user.level,
          }))
        )
      }
    } catch (error) {
      console.log("Backend not available - no demo users will be shown")
      
      if (mountedRef.current) {
        setDemoUsers([])
        
        // Don't retry on rate limit errors
        if (error.response?.status === 429) {
          console.warn("Rate limited - skipping demo users")
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsDemoLoading(false)
      }
    }
  }

  const handleQuickFill = (user) => {
    setEmail(user.email)
    setPassword("password")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, password)

      if (result.success) {
        showSuccess("Login successful!")
      } else {
        setError(result.message)
        showError(result.message)
      }
    } catch (err) {
      const errorMsg = "Login failed. Please try again."
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based authentication with multi-level security",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete user lifecycle management with role assignment",
    },
    {
      icon: Ticket,
      title: "Ticket System",
      description: "Advanced ticket management with automatic escalation",
    },
  ]

  const isDevelopment = process.env.NODE_ENV === "development" || 
                       process.env.REACT_APP_ENV === "development" ||
                       window.location.hostname === "localhost"
  
  // Simplified demo section visibility
  const shouldShowDemoSection = isDevelopment && demoUsers.length > 0

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Side - Branding and Features */}
        <div className="login-branding">
          <div className="branding-header">
            <div className="brand-icon">
              <Shield size={32} />
            </div>
            <h1>Ticket Management System</h1>
            <p>Professional ticket management with automated escalation workflows</p>
          </div>

          <div className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">
                  <feature.icon size={20} />
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your dashboard</p>
            </div>

            <div className="login-form-content">
              {error && (
                <div className="error-alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Demo section - simplified visibility logic */}
              {shouldShowDemoSection && (
                <div className="login-footer">
                  <div className="demo-credentials">
                    <p>
                      <strong>Available Test Accounts:</strong>
                    </p>
                    <div className="demo-buttons">
                      {demoUsers.map((user, index) => (
                        <button 
                          key={index} 
                          type="button" 
                          className="demo-button" 
                          onClick={() => handleQuickFill(user)}
                        >
                          {user.name} ({user.role})
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
                      Click to auto-fill credentials
                    </p>
                  </div>
                </div>
              )}

              {/* Show loading only during initial load */}
              {isDevelopment && isDemoLoading && (
                <div className="login-footer">
                  <div style={{ padding: "1rem", textAlign: "center", color: "#64748b" }}>
                    Loading demo accounts...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="copyright">
            <p>© 2024 Ticket Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage