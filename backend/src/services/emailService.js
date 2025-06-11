const { transporter, emailConfig, emailTemplates } = require('../config/email');

const sendSlotBookedEmail = async (bookingDetails) => {
  try {
    console.log('Starting email send process...');
    console.log('Email configuration:', {
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      hasUser: !!process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
    
    const { subject, html } = emailTemplates.slotBooked(bookingDetails);
    console.log('Email template generated:', { subject });

    const mailOptions = {
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      subject,
      html,
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      stack: error.stack
    });
    return false;
  }
};

module.exports = {
  sendSlotBookedEmail,
}; 