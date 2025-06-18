const nodemailer = require('nodemailer');
require('dotenv').config();

// Log environment variables (without exposing the password)
console.log('Email Configuration Check:', {
  hasEmailUser: !!process.env.EMAIL_USER,
  emailUser: process.env.EMAIL_USER,
  hasEmailPassword: !!process.env.EMAIL_PASSWORD,
  hasAdminEmail: !!process.env.ADMIN_EMAIL
});

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test the connection immediately
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
  } else {
    console.log('SMTP Connection Successful');
  }
});

// Email configuration
const emailConfig = {
  from: process.env.EMAIL_USER,
  adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
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
      `
    };
  },
  contactForm: (contactDetails) => {
    return {
      subject: `New Contact Form Submission from ${contactDetails.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactDetails.name}</p>
        <p><strong>Contact Number:</strong> ${contactDetails.contactNumber}</p>
        <p><strong>Email:</strong> ${contactDetails.email}</p>
        <p><strong>Query:</strong><br/>${contactDetails.query}</p>
      `
    };
  }
};

module.exports = {
  transporter,
  emailConfig,
  emailTemplates
}; 