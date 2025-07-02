"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Ticket, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { adminAPI } from "../services/api"
import "./ClientLogin.css"

const ClientLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [demoClient, setDemoClient] = useState(null)

  const { login } = useAuth()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    loadDemoClient()
  }, [])

  const loadDemoClient = async () => {
    try {
      // Only get client users from backend - no fallback
      const users = await adminAPI.getUsers()
      const clientUser = users.find((user) => user.role === "client")

      if (clientUser) {
        setDemoClient({
          email: clientUser.email,
          name: clientUser.username,
          role: "client",
        })
      } else {
        setDemoClient(null)
      }
    } catch (error) {
      console.log("Backend not available - no demo client will be shown")
      setDemoClient(null)
    }
  }

  const handleQuickFill = () => {
    if (demoClient) {
      setEmail(demoClient.email)
      setPassword("password") // Default password for demo
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(email, password)

    if (result.success) {
      showSuccess("Welcome to your client portal!")
    } else {
      setError(result.message)
      showError(result.message)
    }

    setIsLoading(false)
  }

  const features = [
    {
      icon: Ticket,
      title: "Submit Tickets",
      description: "Create and track support tickets easily",
    },
    {
      icon: MessageSquare,
      title: "Real-time Updates",
      description: "Get instant notifications on ticket progress",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for your issues",
    },
  ]

  return (
    <div className="client-login-container">
      <div className="client-login-content">
        {/* Left Side - Client Branding */}
        <div className="client-branding">
          <div className="client-branding-header">
            <div className="client-brand-icon">
              <Ticket size={32} />
            </div>
            <h1>Client Portal</h1>
            <p>Your dedicated support center for seamless ticket management and assistance</p>
          </div>

          <div className="client-features">
            {features.map((feature, index) => (
              <div key={index} className="client-feature">
                <div className="client-feature-icon">
                  <feature.icon size={20} />
                </div>
                <div className="client-feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="client-login-form-container">
          <div className="client-login-card">
            <div className="client-login-header">
              <h2>Client Access</h2>
              <p>Sign in to manage your support tickets</p>
            </div>

            <div className="client-login-form-content">
              {error && (
                <div className="client-error-alert">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="client-login-form">
                <div className="client-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="client-form-group">
                  <label htmlFor="password">Password</label>
                  <div className="client-password-input">
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
                      className="client-password-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="client-login-button" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Access Portal"}
                </button>
              </form>

              {demoClient && (
                <div className="client-demo-section">
                  <p>Demo Client Account:</p>
                  <button type="button" className="client-demo-button" onClick={handleQuickFill}>
                    <strong>{demoClient.name}</strong> - <span>{demoClient.email}</span>
                  </button>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                    Default password: "password"
                  </p>
                </div>
              )}

              <div className="client-login-footer">
                <p>Need help? Contact our support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientLogin