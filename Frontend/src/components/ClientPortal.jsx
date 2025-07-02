"use client"

import { useState, useEffect } from "react"
import { Ticket, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import { ticketsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import Modal from "./Modal"
import "./ClientPortal.css"

const ClientPortal = () => {
  const { user, logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)

      // Try to get user's tickets from backend
      try {
        const response = await ticketsAPI.getMyTickets()
        setTickets(response.tickets || [])
      } catch (error) {
        // Fallback: get all tickets and filter by user
        const response = await ticketsAPI.getTickets()
        const userTickets =
          response.tickets?.filter(
            (ticket) => ticket.createdBy?._id === user?.id || ticket.createdBy?.id === user?.id,
          ) || []
        setTickets(userTickets)
      }
    } catch (error) {
      console.error("Error loading tickets:", error)
      showError("Failed to load tickets")
      setTickets([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      await ticketsAPI.createTicket(newTicket)
      showSuccess("Ticket created successfully! Our team will review it shortly.")
      setIsCreateModalOpen(false)
      setNewTicket({ title: "", description: "", priority: "medium" })
      loadTickets()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create ticket")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: "blue",
      in_progress: "orange",
      resolved: "green",
      closed: "gray",
    }
    return colors[status] || "gray"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "green",
      medium: "orange",
      high: "red",
      urgent: "red",
    }
    return colors[priority] || "gray"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock size={16} />
      case "in_progress":
        return <MessageSquare size={16} />
      case "resolved":
        return <CheckCircle size={16} />
      case "closed":
        return <CheckCircle size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  // Calculate stats from actual tickets
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  }

  const quickActions = [
    {
      icon: Plus,
      title: "Create New Ticket",
      description: "Submit a new support request",
      action: () => setIsCreateModalOpen(true),
    },
    {
      icon: MessageSquare,
      title: "Contact Support",
      description: "Get in touch with our support team",
      action: () => showSuccess("Contact feature coming soon!"),
    },
    {
      icon: User,
      title: "Account Settings",
      description: "Manage your account preferences",
      action: () => showSuccess("Settings feature coming soon!"),
    },
  ]

  return (
    <div className="client-portal">
      {/* Header */}
      <div className="client-header">
        <div className="client-header-content">
          <div className="client-brand">
            <div className="client-brand-icon">
              <Ticket size={20} />
            </div>
            <h1>Client Portal</h1>
          </div>
          <div className="client-user-info">
            <div className="client-user-details">
              <p className="client-user-name">{user?.username || user?.name}</p>
              <p className="client-user-role">Client Account</p>
            </div>
            <button onClick={logout} className="client-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="client-content">
        {/* Welcome Section */}
        <div className="client-welcome">
          <h2>Welcome back, {user?.username || user?.name}!</h2>
          <p>Manage your support tickets and get help from our dedicated team.</p>
        </div>

        {/* Stats */}
        <div className="client-stats">
          <div className="client-stat-card">
            <div className="client-stat-icon blue">
              <Ticket size={20} />
            </div>
            <div className="client-stat-value">{stats.total}</div>
            <div className="client-stat-label">Total Tickets</div>
          </div>
          <div className="client-stat-card">
            <div className="client-stat-icon orange">
              <Clock size={20} />
            </div>
            <div className="client-stat-value">{stats.open}</div>
            <div className="client-stat-label">Open Tickets</div>
          </div>
          <div className="client-stat-card">
            <div className="client-stat-icon orange">
              <MessageSquare size={20} />
            </div>
            <div className="client-stat-value">{stats.inProgress}</div>
            <div className="client-stat-label">In Progress</div>
          </div>
          <div className="client-stat-card">
            <div className="client-stat-icon green">
              <CheckCircle size={20} />
            </div>
            <div className="client-stat-value">{stats.resolved}</div>
            <div className="client-stat-label">Resolved</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="client-actions">
          {quickActions.map((action, index) => (
            <div key={index} className="client-action-card" onClick={action.action}>
              <div className="client-action-icon">
                <action.icon size={20} />
              </div>
              <h3 className="client-action-title">{action.title}</h3>
              <p className="client-action-description">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div className="activity-card">
          <div className="card-header">
            <div className="header-title">
              <Ticket size={20} />
              <span>Your Recent Tickets</span>
            </div>
            <p className="header-description">Track the status of your support requests</p>
          </div>
          <div className="card-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <Ticket size={48} />
                <h3>No tickets yet</h3>
                <p>Create your first support ticket to get started</p>
              </div>
            ) : (
              <div className="tickets-list">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket._id} className="ticket-item">
                    <div className="ticket-info">
                      <div className="ticket-header">
                        <span className="ticket-id">{ticket.ticketId}</span>
                        <div className="ticket-badges">
                          <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace("_", " ")}
                          </span>
                          <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <h4 className="ticket-title">{ticket.title}</h4>
                      <p className="ticket-meta">
                        Created on {formatDate(ticket.createdAt)}
                        {ticket.assignedTo && ` • Assigned to ${ticket.assignedTo.username}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Support Ticket"
        description="Describe your issue and we'll help you resolve it"
      >
        <form onSubmit={handleCreateTicket} className="modal-form">
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
            >
              <option value="low">Low - General inquiry</option>
              <option value="medium">Medium - Standard issue</option>
              <option value="high">High - Important issue</option>
              <option value="urgent">Urgent - Critical issue</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Please provide detailed information about your issue..."
              rows={5}
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="action-button secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="action-button primary">
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ClientPortal