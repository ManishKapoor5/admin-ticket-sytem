"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminDashboard from "@/components/admin-dashboard"
import TicketDashboard from "@/components/ticket-dashboard"
import UserManagement from "@/components/user-management"
import LoginPage from "@/components/login-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Panel</h1>
            <p className="text-slate-600">Manage users, tickets, and escalation workflows</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-600">
                {user?.role} • {user?.level}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
