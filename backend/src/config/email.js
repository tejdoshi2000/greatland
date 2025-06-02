const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tejdoshi5@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email configuration
const emailConfig = {
  from: process.env.EMAIL_USER || 'tejdoshi5@gmail.com',
  adminEmail: 'tejdoshi5@gmail.com',
};

// Email templates
const emailTemplates = {
  slotBooked: (bookingDetails) => {
    console.log('Creating email template with details:', bookingDetails);
    return {
      subject: `New Viewing Slot Booked - ${bookingDetails.propertyAddress || 'Property'}`,
      html: `
        <h2>New Viewing Slot Booked</h2>
        <p><strong>Property:</strong> ${bookingDetails.propertyAddress || 'Property details not available'}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
        <h3>Visitor Details:</h3>
        <p><strong>Name:</strong> ${bookingDetails.name}</p>
        <p><strong>Family Size:</strong> ${bookingDetails.familySize}</p>
        <p><strong>Contact:</strong> ${bookingDetails.cell}</p>
        <p><strong>Application Status:</strong> ${bookingDetails.hasApplication === 'yes' ? 'Already generated' : 'Not yet generated'}</p>
      `,
    };
  },
};

module.exports = {
  transporter,
  emailConfig,
  emailTemplates
}; 