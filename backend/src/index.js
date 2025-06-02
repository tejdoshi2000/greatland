require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

console.log('--- Greatland Backend Server ---');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log every incoming request (method, path, headers)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Debug: Log the public directory path
const publicPath = path.join(__dirname, '../public');
console.log('Public directory path:', publicPath);

// Serve static files from the public directory
app.use('/static', express.static(publicPath, {
  setHeaders: (res, path) => {
    console.log('Serving file:', path);
  }
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const applicationsDir = path.join(uploadsDir, 'applications');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(applicationsDir)) {
  fs.mkdirSync(applicationsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    // Add CORS headers for uploaded files
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }
}));

// Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const rentalApplicationRoutes = require('./routes/rentalApplications');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api', require('./routes/viewingSlots'));
app.use('/api/rental-applications', rentalApplicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greatland')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Detailed error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message,
    path: req.path
  });
});

// Catch-all 404 handler for debugging
app.use((req, res, next) => {
  console.error('404 Not Found:', {
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    baseUrl: req.baseUrl
  });
  res.status(404).json({ 
    message: 'Not Found', 
    url: req.originalUrl,
    path: req.path,
    baseUrl: req.baseUrl
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 