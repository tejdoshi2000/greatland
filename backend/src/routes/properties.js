const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all properties:', {
      headers: req.headers,
      method: req.method,
      path: req.path
    });

    const properties = await Property.find();
    console.log(`Found ${properties.length} properties`);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available properties
router.get('/available', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'available' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rented properties
router.get('/rented', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'rented' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new property (admin only)
router.post('/', auth, upload.array('images', 50), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    const property = new Property({
      ...req.body,
      images: imageUrls
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: error.message || 'Server error', details: error });
  }
});

// Update property (admin only)
router.put('/:id', auth, upload.array('images', 50), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    Object.assign(property, updates);
    await property.save();
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 