// ClientSignup.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../contexts/ToastContext"
import { authAPI } from "../services/api"
import "./ClientSignup.css"

const ClientSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const { firstName, lastName, username, email, phone, password, confirmPassword } = formData

    // Check required fields
    if (!firstName.trim()) {
      showToast("First name is required", "error")
      return false
    }

    if (!lastName.trim()) {
      showToast("Last name is required", "error")
      return false
    }

    if (!username.trim()) {
      showToast("Username is required", "error")
      return false
    }

    if (!email.trim()) {
      showToast("Email is required", "error")
      return false
    }

    if (!phone.trim()) {
      showToast("Phone number is required", "error")
      return false
    }

    if (!password) {
      showToast("Password is required", "error")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error")
      return false
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (!phoneRegex.test(phone)) {
      showToast("Please enter a valid phone number", "error")
      return false
    }

    // Password validation
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error")
      return false
    }

    // Confirm password
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...signupData } = formData
      
      const response = await authAPI.registerClient(signupData)

      if (response.success) {
        showToast(response.message || "Account created successfully! Please login.", "success")
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        })

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/client-login")
        }, 2000)
      } else {
        showToast(response.message || "Registration failed", "error")
      }
    } catch (error) {
      console.error("Registration error:", error)
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error")
      } else if (error.response?.status === 400) {
        showToast("Please check your input and try again", "error")
      } else if (error.response?.status === 409) {
        showToast("User already exists with this email or username", "error")
      } else {
        showToast("Registration failed. Please try again.", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today - it's free!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                disabled={isLoading}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <small className="password-hint">
              Password must be at least 6 characters long
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientSignup