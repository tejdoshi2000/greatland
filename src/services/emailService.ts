import { transporter, emailConfig, emailTemplates } from '../config/email';

export const sendSlotBookedEmail = async (bookingDetails: {
  propertyAddress: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  familySize: string;
  cell: string;
  hasApplication: string;
}) => {
  try {
    const { subject, html } = emailTemplates.slotBooked(bookingDetails);
    
    await transporter.sendMail({
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 