const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  squareFeet: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  features: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  // New fields for Facts & Features
  numBeds: { type: Number },
  numBaths: { type: Number },
  sqftArea: { type: Number },
  incomeQualification: { type: String },
  creditScoreEligible: { type: String },
  petPolicy: { type: String },
  securityDeposit: { type: String },
  utilitiesPaidBy: { type: String },
  hoaPaidBy: { type: String },
  status: {
    type: String,
    enum: ['available', 'rented'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema); 