const express = require('express');
const cors = require('cors');
const app = express();
const viewingSlotsRouter = require('./routes/viewingSlots');

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Use the viewing slots router
app.use('/api', viewingSlotsRouter);

// ... rest of your app configuration ...

module.exports = app; 