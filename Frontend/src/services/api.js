import axios from "axios"

// Update this URL to match your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

// Admin API
export const adminAPI = {
  createUser: async (userData) => {
    const response = await api.post("/admin/users", userData)
    return response.data
  },

  getUsers: async () => {
    const response = await api.get("/admin/users")
    return response.data
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get("/admin/stats")
    return response.data
  },
}

// Tickets API
export const ticketsAPI = {
  createTicket: async (ticketData) => {
    const response = await api.post("/tickets", ticketData)
    return response.data
  },

  getTickets: async (params = {}) => {
    const response = await api.get("/tickets", { params })
    return response.data
  },

  getTicket: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`)
    return response.data
  },

  pickTicket: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/pick`)
    return response.data
  },

  updateTicketStatus: async (ticketId, statusData) => {
    const response = await api.put(`/tickets/${ticketId}/status`, statusData)
    return response.data
  },

  getMyTickets: async () => {
    const response = await api.get("/tickets/my")
    return response.data
  },

  getStats: async () => {
    const response = await api.get("/tickets/stats")
    return response.data
  },
}

export default api
