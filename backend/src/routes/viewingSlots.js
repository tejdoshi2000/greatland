console.log("viewingSlots.js loaded");
const express = require('express');
const router = express.Router();
const ViewingSlot = require('../models/ViewingSlot');
const Property = require('../models/Property');
const { sendSlotBookedEmail } = require('../services/emailService');
require('dotenv').config();

// Helper function to split a time range into 10-minute intervals
function splitIntoSlots(startTime, endTime) {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${startTime}`);
  const endDateTime = new Date(`1970-01-01T${endTime}`);
  while (currentTime < endDateTime) {
    const slotStart = currentTime.toTimeString().slice(0, 5);
    currentTime.setMinutes(currentTime.getMinutes() + 10);
    const slotEnd = currentTime.toTimeString().slice(0, 5);
      slots.push({ startTime: slotStart, endTime: slotEnd });
  }
  return slots;
}

// Admin: Create slots (splits into 10-min intervals)
router.post('/admin/properties/:propertyId/slots', async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const propertyId = req.params.propertyId;
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing date, startTime, or endTime' });
    }

    console.log('Checking for existing slots:', {
      propertyId,
      date,
      startTime,
      endTime
    });

    // First, check for existing slots on this date
    const existingSlots = await ViewingSlot.find({
      propertyId,
      date,
      $or: [
        // Check for exact time matches
        { startTime: startTime, endTime: endTime },
        // Check for slots that start during our new time range
        { startTime: { $gte: startTime, $lt: endTime } },
        // Check for slots that end during our new time range
        { endTime: { $gt: startTime, $lte: endTime } },
        // Check for slots that completely contain our new time range
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    console.log('Found existing slots:', existingSlots);

    if (existingSlots.length > 0) {
      console.log('Found overlapping slots:', existingSlots);
      return res.status(400).json({ 
        error: 'Time slot overlaps with existing slots',
        existingSlots: existingSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.isBooked,
          bookedBy: slot.bookedBy
        }))
      });
    }

    const intervals = splitIntoSlots(startTime, endTime);
    const slots = intervals.map(({ startTime, endTime }) => ({
      propertyId,
      date,
      startTime,
      endTime,
      isBooked: false,
      bookedBy: null
    }));
    const created = await ViewingSlot.insertMany(slots);
    res.json(created);
  } catch (err) {
    console.error('Error creating slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all slots for a property
router.get('/admin/properties/:propertyId/slots/all', async (req, res) => {
  const slots = await ViewingSlot.find({ propertyId: req.params.propertyId });
  res.json(slots);
});

// Admin: Delete a slot
router.delete('/admin/properties/:propertyId/slots/:slotId', async (req, res) => {
  await ViewingSlot.findByIdAndDelete(req.params.slotId);
  res.json({ success: true });
});

// User: Get available slots for a property
router.get('/properties/:propertyId/slots', async (req, res) => {
  const slots = await ViewingSlot.find({ propertyId: req.params.propertyId, isBooked: false });
  res.json(slots);
});

// User: Book a slot
console.log("Booking route is about to be registered");
router.post('/properties/:propertyId/slots/:slotId/book', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    console.log('Property ID from URL:', req.params.propertyId);
    console.log('Slot ID from URL:', req.params.slotId);
    console.log('Environment variables:', {
      emailUser: process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD
    });

    const { name, familySize, cell, hasApplication } = req.body;
    
    // First, get the property details
    const property = await Property.findById(req.params.propertyId);
    console.log('Property lookup result:', {
      id: req.params.propertyId,
      found: !!property,
      location: property?.location,
      fullProperty: property
    });

    if (!property) {
      console.error('Property not found for ID:', req.params.propertyId);
      return res.status(404).json({ error: 'Property not found' });
    }

    // Then get and update the slot
    const slot = await ViewingSlot.findOneAndUpdate(
      { _id: req.params.slotId, isBooked: false },
      {
        isBooked: true,
        bookedBy: { name, familySize, cell, hasApplication }
      },
      { new: true }
    );
    
    if (!slot) {
      return res.status(400).json({ error: 'Slot already booked or not found' });
    }

    console.log('Slot booked successfully:', slot);

    // Send email notification to admin
    const emailDetails = {
      propertyAddress: property.location,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      name,
      familySize,
      cell,
      hasApplication
    };
    
    console.log('Sending email with details:', emailDetails);

    const emailSent = await sendSlotBookedEmail(emailDetails);

    console.log('Email sending result:', emailSent);

    if (!emailSent) {
      console.error('Failed to send email notification');
      // Don't return error to user, just log it
    }

    res.json({ success: true, slot });
  } catch (err) {
    console.error('Error booking slot:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check property details
router.get('/test/property/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    console.log('Test property lookup:', {
      id: req.params.id,
      found: !!property,
      data: property
    });
    res.json(property);
  } catch (error) {
    console.error('Test property lookup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test email endpoint
router.post('/test/email', async (req, res) => {
  try {
    const testDetails = {
      propertyAddress: 'Test Property',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '10:30',
      name: 'Test User',
      familySize: '2',
      cell: '1234567890',
      hasApplication: 'no'
    };

    console.log('Testing email with details:', testDetails);
    const emailSent = await sendSlotBookedEmail(testDetails);
    
    if (emailSent) {
      res.json({ success: true, message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 