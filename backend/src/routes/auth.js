const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create initial admin user (should be removed in production)
router.post('/setup', async (req, res) => {
  try {
    // Delete existing admin user if it exists
    await User.deleteOne({ isAdmin: true });

    const admin = new User({
      username: 'admin',
      password: 'admin123', // Change this in production
      isAdmin: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route for setup (for easier testing)
router.get('/setup', async (req, res) => {
  try {
    // Delete existing admin user if it exists
    await User.deleteOne({ isAdmin: true });

    const admin = new User({
      username: 'admin',
      password: 'admin123', // Change this in production
      isAdmin: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset admin user (for testing)
router.post('/reset', async (req, res) => {
  try {
    // Delete existing admin user
    await User.deleteOne({ isAdmin: true });

    // Create new admin user
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });

    await admin.save();
    res.status(201).json({ message: 'Admin user reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 