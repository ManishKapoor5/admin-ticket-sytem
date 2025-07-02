const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEscalationEmail(ticket, escalationLevel) {
    try {
      const subject = `URGENT: Ticket ${ticket.ticketId} Escalated to ${escalationLevel}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">🚨 Ticket Escalation Alert</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Ticket Details:</h3>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            <p><strong>Created:</strong> ${ticket.createdAt.toLocaleString()}</p>
            <p><strong>Escalation Level:</strong> ${escalationLevel}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p><strong>⚠️ Action Required:</strong></p>
            <p>This ticket has been escalated to ${escalationLevel} and requires immediate attention.</p>
            <p>Please assign an available ${escalationLevel} team member to resolve this issue promptly.</p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; font-size: 12px;">
              This is an automated notification from the Ticket Management System.
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@ticketsystem.com',
        to: process.env.ESCALATION_EMAIL || 'admin@company.com',
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Escalation email sent for ticket ${ticket.ticketId}`);
      
      return true;
    } catch (error) {
      console.error('Error sending escalation email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();