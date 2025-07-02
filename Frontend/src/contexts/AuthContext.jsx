"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

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

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")

    // Clear user state
    setUser(null)

    // Force redirect to login page
    window.location.href = "/login"
  }

  const value = {
    user,
    login,
    logout,
    loading,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}