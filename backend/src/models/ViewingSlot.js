const mongoose = require('mongoose');
const ViewingSlotSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  date: { type: String, required: true }, // e.g. '2024-06-01'
  startTime: { type: String, required: true }, // e.g. '14:00'
  endTime: { type: String, required: true },   // e.g. '14:15'
  isBooked: { type: Boolean, default: false },
  bookedBy: {
    name: String,
    familySize: Number,
    cell: String,
    hasApplication: Boolean
  }
});
module.exports = mongoose.model('ViewingSlot', ViewingSlotSchema); 