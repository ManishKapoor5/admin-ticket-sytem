const cron = require('node-cron');
const Ticket = require('../models/Ticket');
const emailService = require('./emailService');

class CronService {
  startCronJobs() {
    // Run every 5 minutes to check for escalations
    cron.schedule('*/5 * * * *', async () => {
      await this.checkTicketEscalations();
    });

    console.log('Cron jobs started successfully');
  }

  async checkTicketEscalations() {
    try {
      const now = new Date();
      
      // Find tickets that need L2 escalation (3 hours)
      const l2EscalationTime = new Date(now.getTime() - (3 * 60 * 60 * 1000)); // 3 hours ago
      const ticketsNeedingL2 = await Ticket.find({
        status: 'open',
        escalationLevel: 'none',
        pickedBy: null,
        createdAt: { $lte: l2EscalationTime }
      }).populate('createdBy', 'username email');

      for (const ticket of ticketsNeedingL2) {
        await this.escalateTicket(ticket, 'L2');
      }

      // Find tickets that need L3 escalation (10 hours total)
      const l3EscalationTime = new Date(now.getTime() - (10 * 60 * 60 * 1000)); // 10 hours ago
      const ticketsNeedingL3 = await Ticket.find({
        status: 'open',
        escalationLevel: 'L2',
        pickedBy: null,
        createdAt: { $lte: l3EscalationTime },
        emailNotificationSent: false
      }).populate('createdBy', 'username email');

      for (const ticket of ticketsNeedingL3) {
        await this.escalateTicket(ticket, 'L3', true);
      }

      if (ticketsNeedingL2.length > 0 || ticketsNeedingL3.length > 0) {
        console.log(`Escalated ${ticketsNeedingL2.length} tickets to L2 and ${ticketsNeedingL3.length} tickets to L3`);
      }

    } catch (error) {
      console.error('Error in ticket escalation cron job:', error);
    }
  }

  async escalateTicket(ticket, escalationLevel, sendEmail = false) {
    try {
      ticket.escalationLevel = escalationLevel;
      ticket.escalatedAt = new Date();

      // Add escalation update
      ticket.updates.push({
        updateType: 'escalation',
        description: `Ticket automatically escalated to ${escalationLevel} due to no response`,
        timestamp: new Date()
      });

      if (sendEmail) {
        const emailSent = await emailService.sendEscalationEmail(ticket, escalationLevel);
        ticket.emailNotificationSent = emailSent;
      }

      await ticket.save();
      
      console.log(`Ticket ${ticket.ticketId} escalated to ${escalationLevel}`);
      
    } catch (error) {
      console.error(`Error escalating ticket ${ticket.ticketId}:`, error);
    }
  }
}

const cronService = new CronService();

module.exports = {
  startCronJobs: () => cronService.startCronJobs()
};