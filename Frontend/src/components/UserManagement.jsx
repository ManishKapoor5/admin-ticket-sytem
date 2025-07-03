"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Edit, Trash2, UserPlus } from "lucide-react"
import { adminAPI } from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Modal from "./Modal"
import "./UserManagement.css"

const UserManagement = () => {
  const { showSuccess, showError } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "developer",
    level: "L1",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getUsers()
      setUsers(response || [])
    } catch (error) {
      console.error("Error loading users:", error)
      showError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createUser(newUser)
      showSuccess("User created successfully!")
      setIsCreateModalOpen(false)
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "developer",
        level: "L1",
      })
      loadUsers()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create user")
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.updateUser(selectedUser._id, {
        role: selectedUser.role,
        level: selectedUser.level,
        isActive: selectedUser.isActive,
      })
      showSuccess("User updated successfully!")
      setIsEditModalOpen(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await adminAPI.deleteUser(userId)
        showSuccess("User deactivated successfully!")
        loadUsers()
      } catch (error) {
        showError(error.response?.data?.message || "Failed to deactivate user")
      }
    }
  }

  const openEditModal = (user) => {
    setSelectedUser({ ...user })
    setIsEditModalOpen(true)
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: "purple",
      developer: "blue",
      client_management: "green",
      client: "orange",
    }
    return colors[role] || "gray"
  }

  const getLevelColor = (level) => {
    const colors = {
      L1: "yellow",
      L2: "orange",
      L3: "red",
    }
    return colors[level] || "gray"
  }

  const getStatusColor = (isActive) => {
    return isActive ? "green" : "gray"
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: "Administrator",
      developer: "Developer",
      client_management: "Client Management",
      client: "Client",
    }
    return roleMap[role] || role
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesLevel = filterLevel === "all" || user.level === filterLevel
    return matchesSearch && matchesRole && matchesLevel
  })

  return (
    <div className="user-management">
      {/* Header with Search and Filters */}
      <div className="user-header">
        <div className="search-filters">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="developer">Developer</option>
              <option value="client_management">Client Management</option>
              <option value="client">Client</option>
            </select>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>
        </div>

        <button className="create-button" onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus size={16} />
          Create User
        </button>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <div className="user-info">
                  <div className="user-avatar">{getInitials(user.username)}</div>
                  <div className="user-details">
                    <h3 className="user-name">{user.username}</h3>
                    <div className="user-badges">
                      <span className={`role-badge ${getRoleColor(user.role)}`}>{getRoleDisplay(user.role)}</span>
                      {user.level && <span className={`level-badge ${getLevelColor(user.level)}`}>{user.level}</span>}
                    </div>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(user.isActive)}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="user-card-content">
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-label">Joined</span>
                    <p className="stat-value" style={{ fontSize: '16px' }}>{formatDate(user.createdAt)}</p>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Role</span>
                    <p className="stat-value" style={{ fontSize: '16px' }}>{getRoleDisplay(user.role)}</p>
                  </div>
                </div>

                <div className="user-actions">
                  <button className="action-button secondary" onClick={() => openEditModal(user)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    className="action-button danger"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={!user.isActive}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="empty-state">
          <UserPlus size={48} />
          <h3>No users found</h3>
          <p>
            {searchTerm || filterRole !== "all" || filterLevel !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No users have been created yet"}
          </p>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        description="Add a new user to the system"
      >
        <form onSubmit={handleCreateUser} className="modal-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="user@company.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="developer">Developer</option>
              <option value="client_management">Client Management</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          {(newUser.role === "developer" || newUser.role === "client_management") && (
            <div className="form-group">
              <label>Level</label>
              <select value={newUser.level} onChange={(e) => setNewUser({ ...newUser, level: e.target.value })}>
                <option value="L1">Level 1 (L1)</option>
                <option value="L2">Level 2 (L2)</option>
                <option value="L3">Level 3 (L3)</option>
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="action-button secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="action-button primary">
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        description="Update user information"
      >
        {selectedUser && (
          <form onSubmit={handleEditUser} className="modal-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={selectedUser.username} disabled className="disabled-input" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={selectedUser.email} disabled className="disabled-input" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="developer">Developer</option>
                <option value="client_management">Client Management</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            {(selectedUser.role === "developer" || selectedUser.role === "client_management") && (
              <div className="form-group">
                <label>Level</label>
                <select
                  value={selectedUser.level || "L1"}
                  onChange={(e) => setSelectedUser({ ...selectedUser, level: e.target.value })}
                >
                  <option value="L1">Level 1 (L1)</option>
                  <option value="L2">Level 2 (L2)</option>
                  <option value="L3">Level 3 (L3)</option>
                </select>
              </div>
            )}
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={selectedUser.isActive}
                  onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
                />
                Active User
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="action-button secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="action-button primary">
                Update User
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default UserManagement