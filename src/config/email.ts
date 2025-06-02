import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tejdoshi5@gmail.com',
    pass: process.env.EMAIL_PASSWORD, // This should be set in .env file
  },
});

// Email configuration
export const emailConfig = {
  from: process.env.EMAIL_USER || 'tejdoshi5@gmail.com',
  adminEmail: 'tejdoshi5@gmail.com',
};

// Email templates
export const emailTemplates = {
  slotBooked: (bookingDetails: {
    propertyAddress: string;
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    familySize: string;
    cell: string;
    hasApplication: string;
  }) => ({
    subject: `New Viewing Slot Booked - ${bookingDetails.propertyAddress}`,
    html: `
      <h2>New Viewing Slot Booked</h2>
      <p><strong>Property:</strong> ${bookingDetails.propertyAddress}</p>
      <p><strong>Date:</strong> ${bookingDetails.date}</p>
      <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
      <h3>Visitor Details:</h3>
      <p><strong>Name:</strong> ${bookingDetails.name}</p>
      <p><strong>Family Size:</strong> ${bookingDetails.familySize}</p>
      <p><strong>Contact:</strong> ${bookingDetails.cell}</p>
      <p><strong>Application Status:</strong> ${bookingDetails.hasApplication === 'yes' ? 'Already generated' : 'Not yet generated'}</p>
    `,
  }),
}; 