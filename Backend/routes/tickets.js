const express = require('express');
const Ticket = require('../models/Ticket');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create ticket (clients only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create tickets' });
    }

    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user._id
    });

    await ticket.save();
    await ticket.populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tickets (visible to all users)
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, escalationLevel, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (escalationLevel) filter.escalationLevel = escalationLevel;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email level')
      .populate('pickedBy', 'username email level')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ticket.countDocuments(filter);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Pick ticket
router.post('/:id/pick', auth, async (req, res) => {
  try {
    // Only developers and client management can pick tickets
    if (!['developer', 'client_management'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.pickedBy) {
      return res.status(400).json({ message: 'Ticket already picked by another user' });
    }

    // Set resolution deadline (e.g., 7 days from pick)
    const resolutionDeadline = new Date();
    resolutionDeadline.setDate(resolutionDeadline.getDate() + 7);

    ticket.pickedBy = req.user._id;
    ticket.pickedAt = new Date();
    ticket.assignedTo = req.user._id;
    ticket.status = 'in_progress';
    ticket.resolutionDeadline = resolutionDeadline;

    // Add update log
    ticket.updates.push({
      updatedBy: req.user._id,
      updateType: 'assignment',
      description: `Ticket picked by ${req.user.username} (${req.user.level})`,
      timestamp: new Date()
    });

    await ticket.save();
    await ticket.populate(['createdBy', 'assignedTo', 'pickedBy']);

    res.json({
      message: 'Ticket picked successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ticket status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can update this ticket
    if (ticket.assignedTo && !ticket.assignedTo.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only update tickets assigned to you' });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    }

    // Add update log
    ticket.updates.push({
      updatedBy: req.user._id,
      updateType: 'status_change',
      description: `Status changed from ${oldStatus} to ${status}${comment ? `: ${comment}` : ''}`,
      timestamp: new Date()
    });

    await ticket.save();
    await ticket.populate(['createdBy', 'assignedTo', 'pickedBy']);

    res.json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ticket by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email level')
      .populate('pickedBy', 'username email level')
      .populate('updates.updatedBy', 'username');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Ticket statistics route
router.get('/stats', auth, async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ticketsToday = await Ticket.countDocuments({ createdAt: { $gte: today } });

    res.json({
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      today: ticketsToday,
    });
  } catch (error) {
    console.error("Ticket stats error:", error.message);
    res.status(500).json({ message: "Failed to load ticket stats", error: error.message });
  }
});


module.exports = router;