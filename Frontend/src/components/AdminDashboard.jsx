"use client"

import { useState, useEffect } from "react"
import { Users, Ticket, AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { ticketsAPI, adminAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const { user } = useAuth()
  const { showError } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    openTickets: 0,
    escalatedTickets: 0,
    avgResolutionTime: "N/A",
  })
  const [recentTickets, setRecentTickets] = useState([])
  const [userStats, setUserStats] = useState({
    byRole: {},
    byLevel: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load tickets
      const ticketsResponse = await ticketsAPI.getTickets({ limit: 5, sort: "-createdAt" })
      setRecentTickets(ticketsResponse.tickets || [])

      // Load ticket stats
      try {
        const ticketStats = await ticketsAPI.getStats()
        setStats((prev) => ({
          ...prev,
          openTickets: ticketStats.openTickets || 0,
          escalatedTickets: ticketStats.escalatedTickets || 0,
          avgResolutionTime: ticketStats.avgResolutionTime || "N/A",
        }))
      } catch (error) {
        // Fallback: calculate stats from tickets
        const allTicketsResponse = await ticketsAPI.getTickets({ limit: 1000 })
        const allTickets = allTicketsResponse.tickets || []

        const openTickets = allTickets.filter((t) => t.status === "open" || t.status === "in_progress").length
        const escalatedTickets = allTickets.filter((t) => t.escalationLevel && t.escalationLevel !== "none").length

        setStats((prev) => ({
          ...prev,
          openTickets,
          escalatedTickets,
          avgResolutionTime: "2.4 days", // This would be calculated from resolved tickets
        }))
      }

      // Load users if admin
      if (user?.role === "admin") {
        try {
          const usersResponse = await adminAPI.getUsers()
          const users = usersResponse || []

          setStats((prev) => ({
            ...prev,
            totalUsers: users.length,
          }))

          // Calculate user distribution
          const roleDistribution = {}
          const levelDistribution = {}

          users.forEach((user) => {
            roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1
            if (user.level) {
              levelDistribution[user.level] = (levelDistribution[user.level] || 0) + 1
            }
          })

          setUserStats({
            byRole: roleDistribution,
            byLevel: levelDistribution,
          })
        } catch (error) {
          console.error("Error loading users:", error)
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      showError("Failed to load dashboard data")
    } finally {
      setLoading(false)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: "Administrator",
      developer: "Developer",
      client_management: "Client Management",
      client: "Client",
    }
    return roleMap[role] || role
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Active system users",
      icon: Users,
      color: "blue",
      show: user?.role === "admin",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets.toString(),
      description: "Awaiting resolution",
      icon: Ticket,
      color: "green",
      show: true,
    },
    {
      title: "Escalated Tickets",
      value: stats.escalatedTickets.toString(),
      description: "Require immediate attention",
      icon: AlertTriangle,
      color: "red",
      show: true,
    },
    {
      title: "Avg Resolution Time",
      value: stats.avgResolutionTime,
      description: "Last 30 days",
      icon: Clock,
      color: "purple",
      show: true,
    },
  ].filter((stat) => stat.show)

  return (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="activity-card">
        <div className="card-header">
          <div className="header-title">
            <TrendingUp size={20} />
            <span>Recent Tickets</span>
          </div>
          <p className="header-description">Latest ticket activities</p>
        </div>
        <div className="card-content">
          {recentTickets.length === 0 ? (
            <p className="no-data">No tickets found</p>
          ) : (
            <div className="tickets-list">
              {recentTickets.map((ticket) => (
                <div key={ticket._id} className="ticket-item">
                  <div className="ticket-info">
                    <div className="ticket-header">
                      <span className="ticket-id">{ticket.ticketId}</span>
                      <div className="ticket-badges">
                        <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                      </div>
                    </div>
                    <h4 className="ticket-title">{ticket.title}</h4>
                    <p className="ticket-meta">
                      Created by {ticket.createdBy?.username || "Unknown"} on {formatDate(ticket.createdAt)}
                      {ticket.assignedTo && ` • Assigned to ${ticket.assignedTo.username}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Distribution - Only show for admins */}
      {user?.role === "admin" && Object.keys(userStats.byRole).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="activity-card">
            <div className="card-header">
              <div className="header-title">
                <Users size={20} />
                <span>User Distribution by Role</span>
              </div>
              <p className="header-description">Current user roles in the system</p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {Object.entries(userStats.byRole).map(([role, count]) => {
                  const total = Object.values(userStats.byRole).reduce((a, b) => a + b, 0)
                  const percentage = Math.round((count / total) * 100)

                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getRoleDisplayName(role)}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-slate-600">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {Object.keys(userStats.byLevel).length > 0 && (
            <div className="activity-card">
              <div className="card-header">
                <div className="header-title">
                  <Users size={20} />
                  <span>User Distribution by Level</span>
                </div>
                <p className="header-description">Current user levels in the system</p>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {Object.entries(userStats.byLevel).map(([level, count]) => {
                    const total = Object.values(userStats.byLevel).reduce((a, b) => a + b, 0)
                    const percentage = Math.round((count / total) * 100)

                    const levelColors = {
                      L1: "bg-yellow-500",
                      L2: "bg-orange-500",
                      L3: "bg-red-500",
                    }

                    return (
                      <div key={level} className="flex items-center justify-between">
                        <span className="text-sm font-medium">Level {level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${levelColors[level] || "bg-gray-500"}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard