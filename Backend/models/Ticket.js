const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickedAt: {
    type: Date,
    default: null
  },
  escalationLevel: {
    type: String,
    enum: ['none', 'L2', 'L3'],
    default: 'none'
  },
  escalatedAt: {
    type: Date,
    default: null
  },
  resolutionDeadline: {
    type: Date,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  emailNotificationSent: {
    type: Boolean,
    default: false
  },
  updates: [{
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updateType: {
      type: String,
      enum: ['status_change', 'assignment', 'comment', 'escalation']
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate unique ticket ID
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);