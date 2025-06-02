const { transporter, emailConfig, emailTemplates } = require('../config/email');

const sendSlotBookedEmail = async (bookingDetails) => {
  try {
    console.log('Preparing to send email with details:', bookingDetails);
    
    const { subject, html } = emailTemplates.slotBooked(bookingDetails);
    console.log('Email template generated:', { subject });

    const mailOptions = {
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      subject,
      html,
    };

    console.log('Email config:', { from: mailOptions.from, to: mailOptions.to });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendSlotBookedEmail,
}; 