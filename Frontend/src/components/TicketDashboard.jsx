"use client"

import { useState, useEffect } from "react"
import { Search, Plus, AlertTriangle, User, Calendar, ArrowUp, Ticket } from "lucide-react"
import { ticketsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import Modal from "./Modal"
import "./TicketDashboard.css"

const TicketDashboard = () => {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    loadTickets()
  }, [filterStatus, filterPriority])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterStatus !== "all") params.status = filterStatus
      if (filterPriority !== "all") params.priority = filterPriority

      const response = await ticketsAPI.getTickets(params)
      setTickets(response.tickets || [])
    } catch (error) {
      console.error("Error loading tickets:", error)
      showError("Failed to load tickets")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      await ticketsAPI.createTicket(newTicket)
      showSuccess("Ticket created successfully!")
      setIsCreateModalOpen(false)
      setNewTicket({ title: "", description: "", priority: "medium" })
      loadTickets()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create ticket")
    }
  }

  const handlePickTicket = async (ticketId) => {
    try {
      await ticketsAPI.pickTicket(ticketId)
      showSuccess("Ticket picked successfully!")
      loadTickets()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to pick ticket")
    }
  }

  const handleStatusUpdate = async (ticketId, status, comment = "") => {
    try {
      await ticketsAPI.updateTicketStatus(ticketId, { status, comment })
      showSuccess("Ticket status updated!")
      loadTickets()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update ticket")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: "blue",
      in_progress: "yellow",
      resolved: "green",
      closed: "gray",
    }
    return colors[status] || "gray"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "green",
      medium: "yellow",
      high: "orange",
      urgent: "red",
    }
    return colors[priority] || "gray"
  }

  const getEscalationColor = (level) => {
    const colors = {
      none: "gray",
      L2: "orange",
      L3: "red",
    }
    return colors[level] || "gray"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy?.username.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const canPickTicket = (ticket) => {
    return (
      !ticket.pickedBy && (user?.role === "developer" || user?.role === "client_management") && ticket.status === "open"
    )
  }

  const canUpdateStatus = (ticket) => {
    return ticket.assignedTo?._id === user?.id || user?.role === "admin"
  }

  return (
    <div className="ticket-dashboard">
      {/* Header with Search and Filters */}
      <div className="ticket-header">
        <div className="search-filters">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {user?.role === "client" && (
          <button className="create-button" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} />
            Create Ticket
          </button>
        )}
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              {ticket.escalationLevel !== "none" && (
                <div className={`escalation-badge ${getEscalationColor(ticket.escalationLevel)}`}>
                  <ArrowUp size={12} />
                  Escalated {ticket.escalationLevel}
                </div>
              )}

              <div className="ticket-card-header">
                <div className="ticket-info">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  <div className="ticket-meta">
                    <span className="ticket-id">{ticket.ticketId}</span>
                    <span>•</span>
                    <span>by {ticket.createdBy?.username}</span>
                  </div>
                </div>
                <div className="ticket-badges">
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                </div>
              </div>

              <div className="ticket-card-content">
                <p className="ticket-description">{ticket.description}</p>

                <div className="ticket-details">
                  <div className="detail-item">
                    <User size={16} />
                    <span>{ticket.assignedTo?.username || "Unassigned"}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Created {formatDate(ticket.createdAt)}</span>
                  </div>
                </div>

                {ticket.escalatedAt && (
                  <div className="escalation-info">
                    <AlertTriangle size={16} className="escalation-icon" />
                    <span className="escalated-text">Escalated on {formatDate(ticket.escalatedAt)}</span>
                  </div>
                )}

                <div className="ticket-actions">
                  {canPickTicket(ticket) && (
                    <button className="action-button primary" onClick={() => handlePickTicket(ticket._id)}>
                      Pick Ticket
                    </button>
                  )}

                  {canUpdateStatus(ticket) && ticket.status !== "resolved" && ticket.status !== "closed" && (
                    <button
                      className="action-button secondary"
                      onClick={() => handleStatusUpdate(ticket._id, "resolved")}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTickets.length === 0 && !loading && (
        <div className="empty-state">
          <Ticket size={48} />
          <h3>No tickets found</h3>
          <p>
            {searchTerm || filterStatus !== "all" || filterPriority !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No tickets have been created yet"}
          </p>
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Ticket"
        description="Create a new support ticket"
      >
        <form onSubmit={handleCreateTicket} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Brief description of the issue"
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Detailed description of the issue"
              rows={4}
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
              Create Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TicketDashboard