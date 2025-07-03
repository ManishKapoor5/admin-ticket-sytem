// AuthContext.js - Fixed version to prevent infinite re-renders
import { createContext, useContext, useState, useEffect, useRef, useMemo } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Prevent double initialization in StrictMode
  const initialized = useRef(false)
  const mounted = useRef(true)
  
  // Debug: Track renders (remove this in production)
  const renderCount = useRef(0)
  renderCount.current += 1
  console.log('AuthProvider render #', renderCount.current, { 
    user: user?.email || 'null', 
    loading, 
    error: !!error 
  })

  // Check authentication status
  useEffect(() => {
    let isCancelled = false
    
    const checkAuth = async () => {
      // Prevent double initialization
      if (initialized.current) return
      initialized.current = true
      
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          if (!isCancelled && mounted.current) {
            setLoading(false)
          }
          return
        }

        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!isCancelled && mounted.current) {
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Invalid token
            localStorage.removeItem('token')
            setUser(null)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        if (!isCancelled && mounted.current) {
          localStorage.removeItem('token')
          setUser(null)
          setError(err.message)
          setLoading(false)
        }
      }
    }

    checkAuth()
    
    return () => {
      isCancelled = true
    }
  }, []) // Empty dependency array - only run once!

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        setError(data.message || 'Login failed')
        return { success: false, error: data.message }
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return { success: true }
      } else {
        setError(data.message || 'Registration failed')
        return { success: false, error: data.message }
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
    // Don't set loading to true - user is immediately logged out
  }

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error]) // Only re-create when these change

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}