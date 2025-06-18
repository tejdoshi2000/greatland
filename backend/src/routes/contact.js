const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

router.post('/', async (req, res) => {
  const { name, contactNumber, email, query } = req.body;
  if (!name || !contactNumber || !email || !query) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const emailSent = await sendContactEmail({ name, contactNumber, email, query });
    if (emailSent) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ message: 'Failed to send email.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 