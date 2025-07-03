// routes/authRoutes.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { auth, adminAuth } = require('../middleware/auth')
const rateLimit = require('express-rate-limit')
const router = express.Router()

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Stricter rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Helper function for password validation
const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character' }
  }

  return { isValid: true }
}

// Helper function for user registration
const registerUser = async (userData, userType = 'customer') => {
  const { name, email, password, phone } = userData

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  // Validate password
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message)
  }

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    role: userType
  })

  await user.save()

  // Generate JWT token
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  }
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      })
    }

    // Phone validation (optional)
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number'
      })
    }

    const result = await registerUser({ name, email, password, phone })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    })

  } catch (error) {
    console.error('Registration error:', error)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      })
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed'
    })
  }
})

// @route   POST /api/auth/register/client
// @desc    Register a new client (admin only)
// @access  Private (Admin)
router.post('/register/client', adminAuth, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      })
    }

    const result = await registerUser({ name, email, password, phone }, 'client')

    res.status(201).json({
      success: true,
      message: 'Client registered successfully',
      data: result
    })

  } catch (error) {
    console.error('Client registration error:', error)

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Client already exists with this email'
      })
    }

    res.status(400).json({
      success: false,
      error: error.message || 'Client registration failed'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    })
  }
})

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error fetching profile'
    })
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body
    const updateData = {}

    if (name) updateData.name = name
    if (phone) {
      // Validate phone number
      if (!/^\+?[\d\s-()]{10,}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid phone number'
        })
      }
      updateData.phone = phone
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error updating profile'
    })
  }
})

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current password and new password'
      })
    }

    // Get user with password
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      })
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword })

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error changing password'
    })
  }
})

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Generate new token
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error refreshing token'
    })
  }
})

// @route   GET /api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: user
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Server error verifying token'
    })
  }
})

module.exports = router