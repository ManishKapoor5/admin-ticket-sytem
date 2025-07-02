"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, Phone, Edit, Trash2, UserPlus } from "lucide-react"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const users = [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      phone: "+1 (555) 123-4567",
      role: "Developer",
      level: "L1",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2024-01-10",
      ticketsAssigned: 5,
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      phone: "+1 (555) 234-5678",
      role: "Developer",
      level: "L2",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-11-15",
      ticketsAssigned: 8,
    },
    {
      id: 3,
      name: "Emily Chen",
      email: "emily.chen@company.com",
      phone: "+1 (555) 345-6789",
      role: "Client Management Team",
      level: "L1",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2024-01-05",
      ticketsAssigned: 3,
    },
    {
      id: 4,
      name: "David Rodriguez",
      email: "david.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      role: "Developer",
      level: "L3",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-08-20",
      ticketsAssigned: 12,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@company.com",
      phone: "+1 (555) 567-8901",
      role: "Client Management Team",
      level: "L2",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-12-01",
      ticketsAssigned: 0,
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Developer":
        return "bg-blue-100 text-blue-800"
      case "Client Management Team":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "L1":
        return "bg-yellow-100 text-yellow-800"
      case "L2":
        return "bg-orange-100 text-orange-800"
      case "L3":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesLevel = filterLevel === "all" || user.level === filterLevel
    return matchesSearch && matchesRole && matchesLevel
  })

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Client Management Team">Client Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="L1">L1</SelectItem>
                <SelectItem value="L2">L2</SelectItem>
                <SelectItem value="L3">L3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system with role and level assignment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Client Management Team">Client Management Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">Level 1 (L1)</SelectItem>
                    <SelectItem value="L2">Level 2 (L2)</SelectItem>
                    <SelectItem value="L3">Level 3 (L3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(user.role)} variant="secondary">
                        {user.role}
                      </Badge>
                      <Badge className={getLevelColor(user.level)} variant="secondary">
                        {user.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(user.status)} variant="secondary">
                  {user.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{user.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Joined</span>
                  <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-slate-500">Tickets</span>
                  <p className="font-medium">{user.ticketsAssigned}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-4">
              <UserPlus className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No users found</h3>
            <p className="text-slate-500 text-center">
              {searchTerm || filterRole !== "all" || filterLevel !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have been created yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
