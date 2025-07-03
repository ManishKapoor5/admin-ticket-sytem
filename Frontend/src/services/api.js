import axios from "axios"

// Update this URL to match your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Token management utilities
const tokenManager = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
}

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle auth errors and other common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      tokenManager.removeToken()
      // Instead of direct redirect, you might want to dispatch an action
      // or use your routing solution (React Router, etc.)
      window.location.href = "/login"
    } else if (error.response?.status === 403) {
      console.error("Access forbidden")
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data?.message)
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request timeout")
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      // Store token after successful login
      if (response.data.token) {
        tokenManager.setToken(response.data.token)
      }
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  },

  // Client Registration (Public route - no auth required)
  registerClient: async (userData) => {
    try {
      const response = await api.post("/auth/register/client", userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get user info")
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send reset email")
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", { token, newPassword })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed")
    }
  },

  // Logout
  logout: () => {
    tokenManager.removeToken()
    window.location.href = "/login"
  },
}

// Admin API
export const adminAPI = {
  createUser: async (userData) => {
    try {
      const response = await api.post("/admin/users", userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user")
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await api.get("/admin/users", { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users")
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user")
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user")
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/admin/stats")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch stats")
    }
  },
}

// Tickets API
export const ticketsAPI = {
  createTicket: async (ticketData) => {
    try {
      const response = await api.post("/tickets", ticketData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create ticket")
    }
  },

  getTickets: async (params = {}) => {
    try {
      const response = await api.get("/tickets", { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch tickets")
    }
  },

  getTicket: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch ticket")
    }
  },

  pickTicket: async (ticketId) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/pick`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to pick ticket")
    }
  },

  updateTicketStatus: async (ticketId, statusData) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/status`, statusData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update ticket status")
    }
  },

  getMyTickets: async () => {
    try {
      const response = await api.get("/tickets/my")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch my tickets")
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/tickets/stats")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch ticket stats")
    }
  },
}

// Export the configured axios instance
export default api

// Export token manager for use in other parts of the app
export { tokenManager }