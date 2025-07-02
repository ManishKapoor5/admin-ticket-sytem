import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Ticket, AlertTriangle, Clock, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "24",
      description: "Active system users",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Open Tickets",
      value: "12",
      description: "Awaiting resolution",
      icon: Ticket,
      color: "bg-green-500",
    },
    {
      title: "Escalated Tickets",
      value: "3",
      description: "Require immediate attention",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Avg Resolution Time",
      value: "2.4 days",
      description: "Last 30 days",
      icon: Clock,
      color: "bg-purple-500",
    },
  ]

  const recentActivity = [
    {
      action: "Ticket #1234 escalated to L2",
      user: "System",
      time: "2 minutes ago",
      type: "escalation",
    },
    {
      action: "New user created: John Doe",
      user: "Admin",
      time: "15 minutes ago",
      type: "user",
    },
    {
      action: "Ticket #1230 picked by Sarah Wilson",
      user: "Sarah Wilson (L1)",
      time: "1 hour ago",
      type: "pickup",
    },
    {
      action: "Ticket #1229 resolved",
      user: "Mike Johnson (L2)",
      time: "2 hours ago",
      type: "resolution",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "escalation"
                        ? "bg-red-500"
                        : activity.type === "user"
                          ? "bg-blue-500"
                          : activity.type === "pickup"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-500">by {activity.user}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>Current user roles in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Developer</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-600">18</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client Management</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-600">6</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution by Level</CardTitle>
            <CardDescription>Current user levels in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Level 1 (L1)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-yellow-500 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-600">12</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Level 2 (L2)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-600">8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Level 3 (L3)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/6 h-full bg-red-500 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-600">4</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
