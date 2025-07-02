"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock } from "lucide-react"

export default function ProtectedRoute({
  children,
  isAuthenticated,
  userRole,
  requiredRole,
  requiredLevel,
  userLevel,
}) {
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-4">
              <Lock className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">Access Denied</h3>
            <p className="text-slate-500 text-center">You need to be logged in to access this page</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole && userRole !== "Administrator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">Insufficient Permissions</h3>
            <p className="text-slate-500 text-center">You don't have the required role to access this resource</p>
            <p className="text-sm text-slate-400 mt-2">
              Required: {requiredRole} | Your role: {userRole}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check level-based access
  if (requiredLevel && userLevel) {
    const levelHierarchy = { L1: 1, L2: 2, L3: 3 }
    const userLevelNum = levelHierarchy[userLevel]
    const requiredLevelNum = levelHierarchy[requiredLevel]

    if (userLevelNum < requiredLevelNum && userRole !== "Administrator") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-slate-400 mb-4">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-slate-600 mb-2">Insufficient Level</h3>
              <p className="text-slate-500 text-center">You don't have the required level to access this resource</p>
              <p className="text-sm text-slate-400 mt-2">
                Required: {requiredLevel} | Your level: {userLevel}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}
