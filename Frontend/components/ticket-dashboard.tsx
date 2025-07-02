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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Clock, AlertTriangle, User, Calendar, ArrowUp, Ticket } from "lucide-react"

export default function TicketDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const tickets = [
    {
      id: "TKT-1234",
      title: "Login authentication issue",
      description: "Users unable to login with correct credentials",
      client: "Acme Corp",
      status: "escalated",
      level: "L2",
      priority: "high",
      createdAt: "2024-01-15T10:30:00Z",
      escalatedAt: "2024-01-15T13:30:00Z",
      assignedTo: null,
      timeRemaining: "7 hours",
      escalationLevel: 2,
    },
    {
      id: "TKT-1235",
      title: "Database connection timeout",
      description: "Application experiencing database connection timeouts during peak hours",
      client: "TechStart Inc",
      status: "in-progress",
      level: "L1",
      priority: "medium",
      createdAt: "2024-01-15T09:15:00Z",
      assignedTo: "Sarah Wilson",
      timeRemaining: "2 days",
      escalationLevel: 1,
    },
    {
      id: "TKT-1236",
      title: "Email notifications not working",
      description: "System not sending email notifications to users",
      client: "Global Solutions",
      status: "critical",
      level: "L3",
      priority: "critical",
      createdAt: "2024-01-14T16:45:00Z",
      escalatedAt: "2024-01-15T02:45:00Z",
      assignedTo: "Mike Johnson",
      timeRemaining: "1 day",
      escalationLevel: 3,
    },
    {
      id: "TKT-1237",
      title: "UI layout issues on mobile",
      description: "Mobile interface not displaying correctly on iOS devices",
      client: "Design Studio",
      status: "open",
      level: "L1",
      priority: "low",
      createdAt: "2024-01-15T14:20:00Z",
      assignedTo: null,
      timeRemaining: "2 hours",
      escalationLevel: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      case "critical":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || ticket.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>Create a new support ticket for client issues</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Client name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Detailed description of the issue" rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Ticket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {ticket.escalationLevel > 1 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-medium">
                <ArrowUp className="h-3 w-3 inline mr-1" />
                Escalated L{ticket.escalationLevel}
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium">{ticket.id}</span>
                    <span>•</span>
                    <span>{ticket.client}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("-", " ")}</Badge>
                  <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{ticket.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{ticket.assignedTo || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{ticket.timeRemaining}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                {ticket.escalatedAt && (
                  <>
                    <span>•</span>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Escalated {new Date(ticket.escalatedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  View Details
                </Button>
                {!ticket.assignedTo && (
                  <Button size="sm" className="flex-1">
                    Pick Ticket
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-4">
              <Ticket className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No tickets found</h3>
            <p className="text-slate-500 text-center">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No tickets have been created yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
