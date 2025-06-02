const express = require('express');
const router = express.Router();
const ViewingSlot = require('../models/ViewingSlot');
const Property = require('../models/Property');
const { sendSlotBookedEmail } = require('../services/emailService');
require('dotenv').config();

// Utility: Split time range into 10-min slots
function splitIntoSlots(startTime, endTime) {
  console.log('Splitting time range:', { startTime, endTime });
  const slots = [];
  
  // Parse start and end times
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  // Convert to total minutes for easier calculation
  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Create 10-minute slots
  while (currentMinutes < endMinutes) {
    const slotStartHour = Math.floor(currentMinutes / 60);
    const slotStartMin = currentMinutes % 60;
    const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
    
    currentMinutes += 10; // Add 10 minutes
    
    const slotEndHour = Math.floor(currentMinutes / 60);
    const slotEndMin = currentMinutes % 60;
    const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;
    
    if (currentMinutes <= endMinutes) {
      slots.push({ startTime: slotStart, endTime: slotEnd });
    }
  }
  
  console.log('Generated slots:', slots);
  return slots;
}

// Admin: Create slots (splits into 10-min intervals)
router.post('/admin/properties/:id/slots', async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const propertyId = req.params.id;
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
    res.status(500).json({ error: 'Failed to create slots', details: err.message });
  }
});

// Admin: Get all slots for a property
router.get('/admin/properties/:id/slots/all', async (req, res) => {
  const slots = await ViewingSlot.find({ propertyId: req.params.id });
  res.json(slots);
});

// Admin: Delete a slot
router.delete('/admin/properties/:id/slots/:slotId', async (req, res) => {
  await ViewingSlot.findByIdAndDelete(req.params.slotId);
  res.json({ success: true });
});

// User: Get available slots for a property
router.get('/properties/:id/slots', async (req, res) => {
  const slots = await ViewingSlot.find({ propertyId: req.params.id, isBooked: false });
  res.json(slots);
});

// User: Book a slot
router.post('/properties/:id/slots/:slotId/book', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    console.log('Property ID from URL:', req.params.id);
    console.log('Slot ID from URL:', req.params.slotId);
    console.log('Environment variables:', {
      emailUser: process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD
    });

    const { name, familySize, cell, hasApplication } = req.body;
    
    // First, get the property details
    const property = await Property.findById(req.params.id);
    console.log('Property lookup result:', {
      id: req.params.id,
      found: !!property,
      location: property?.location,
      fullProperty: property
    });

    if (!property) {
      console.error('Property not found for ID:', req.params.id);
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

    res.json({ success: true });
  } catch (error) {
    console.error('Error in slot booking:', error);
    res.status(500).json({ error: 'Failed to book slot', details: error.message });
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

module.exports = router; 