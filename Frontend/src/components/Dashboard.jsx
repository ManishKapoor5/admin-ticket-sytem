"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import AdminDashboard from "./AdminDashboard"
import TicketDashboard from "./TicketDashboard"
import UserManagement from "./UserManagement"
import "./Dashboard.css"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    { id: "dashboard", label: "Dashboard", component: AdminDashboard },
    { id: "tickets", label: "Ticket Management", component: TicketDashboard },
  ]

  // Add user management tab only for admins
  if (user?.role === "admin") {
    tabs.push({ id: "users", label: "User Management", component: UserManagement })
  }

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || AdminDashboard

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: "Administrator",
      developer: "Developer",
      client_management: "Client Management",
      client: "Client",
    }
    return roleMap[role] || role
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-info">
            <h1>Ticket Management System</h1>
            <p>Manage tickets, users, and escalation workflows</p>
          </div>
          <div className="user-info">
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-role">
                {user?.role} {user?.level && `• ${user.level}`}
              </p>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <div className="tabs-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
