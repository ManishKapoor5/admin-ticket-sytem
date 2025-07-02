"use client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

const UserProfile = ({ onLogout }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">User Profile</h2>
      <p>Welcome to your profile page!</p>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) {
            onLogout()
          }
        }}
        className="text-red-600 hover:text-red-700 bg-transparent"
      >
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </div>
  )
}

export default UserProfile
