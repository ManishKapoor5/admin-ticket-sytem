"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Users, Ticket, AlertCircle } from "lucide-react"

interface LoginPageProps {
  onLogin: (userData: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Demo users for testing
  const demoUsers = [
    {
      email: "admin@company.com",
      password: "admin123",
      name: "Admin User",
      role: "Administrator",
      level: "L3",
    },
    {
      email: "sarah@company.com",
      password: "sarah123",
      name: "Sarah Wilson",
      role: "Developer",
      level: "L1",
    },
    {
      email: "mike@company.com",
      password: "mike123",
      name: "Mike Johnson",
      role: "Developer",
      level: "L2",
    },
    {
      email: "emily@company.com",
      password: "emily123",
      name: "Emily Chen",
      role: "Client Management Team",
      level: "L1",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check demo users
    const user = demoUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      onLogin(user)
    } else {
      setError("Invalid email or password. Try one of the demo accounts.")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (demoUser: any) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  const features = [
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based authentication with multi-level security",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Complete user lifecycle management with role assignment",
    },
    {
      icon: Ticket,
      title: "Ticket System",
      description: "Advanced ticket management with automatic escalation",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Features */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-xl text-slate-600 max-w-md mx-auto lg:mx-0">
              Comprehensive ticket management and user administration system
            </p>
          </div>

          <div className="grid gap-6 max-w-md mx-auto lg:mx-0">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Sign in to access your admin dashboard</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Demo Accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user)}
                    className="text-xs p-2 h-auto flex flex-col items-start"
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="text-slate-500">{user.role}</span>
                  </Button>
                ))}
              </div>

              <div className="text-center text-sm text-slate-500">
                <p>Demo credentials are pre-filled when you click the demo accounts above</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>© 2024 Admin Panel System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
