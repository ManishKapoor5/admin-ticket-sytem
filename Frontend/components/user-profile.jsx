"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Shield, Settings, LogOut } from "lucide-react"

export default function UserProfile({ user, onLogout }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-800"
      case "Developer":
        return "bg-blue-100 text-blue-800"
      case "Client Management Team":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelColor = (level) => {
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

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3 text-slate-400" />
              <span className="text-sm text-slate-600">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge className={getRoleColor(user.role)} variant="secondary">
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
          <Badge className={getLevelColor(user.level)} variant="secondary">
            {user.level}
          </Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onLogout}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
