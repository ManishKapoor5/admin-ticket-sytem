// middleware/auth.js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.header('x-auth-token')

    // Check if no token
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token, authorization denied'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded

    // Optional: Check if user still exists in database
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token is valid but user no longer exists'
      })
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    })
  }
}

// Admin role middleware
const adminAuth = async (req, res, next) => {
  try {
    // First run the basic auth middleware
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Check if user is admin
    const user = await User.findById(req.user.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      })
    }

    next()
  } catch (error) {
    console.error('Admin auth middleware error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error in admin authentication'
    })
  }
}

module.exports = {
  auth,
  adminAuth
}