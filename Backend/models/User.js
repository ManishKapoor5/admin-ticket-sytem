// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'developer', 'client_management', 'client'],
//     required: true
//   },
//   level: {
//     type: String,
//     enum: ['L1', 'L2', 'L3', null],
//     default: null
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

// models/User.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  userType: {
    type: String,
    enum: ['client', 'provider', 'admin'],
    default: 'client'
  },
  companyName: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  profilePicture: {
    type: String, // URL to profile picture
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For providers - additional fields
  services: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number, // years of experience
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  // Location for service providers
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.emailVerificationToken
      delete ret.passwordResetToken
      delete ret.__v
      return ret
    }
  }
})

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ userType: 1 })
userSchema.index({ isActive: 1 })

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Pre-save middleware to ensure email is lowercase
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase()
  }
  next()
})

// Method to check if user is a client
userSchema.methods.isClient = function() {
  return this.userType === 'client'
}

// Method to check if user is a provider
userSchema.methods.isProvider = function() {
  return this.userType === 'provider'
}

// Method to get safe user data (without sensitive fields)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.emailVerificationToken
  delete userObject.passwordResetToken
  delete userObject.passwordResetExpires
  return userObject
}

module.exports = mongoose.model('User', userSchema)