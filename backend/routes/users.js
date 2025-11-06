const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 🧩 Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      preferences: {
        defaultMode: 'developer',
        themes: {
          developer: 'neural-blue',
          learner: 'aurora-teal',
          hr: 'solar-amber'
        },
        darkMode: true,
        xpVisible: true,
        animationsEnabled: true,
      },
      stats: {
        totalChats: 0,
        favoriteMode: 'developer',
        learningXP: 0,
        streakDays: 0,
        lastActive: Date.now(),
      },
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login with your credentials.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 🔐 Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last active timestamp
    user.stats.lastActive = Date.now();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
        preferences: user.preferences || {},
        stats: user.stats || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 👤 Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// 🧾 Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// ⚙️ Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.preferences);
  } catch (error) {
    console.error('Preferences fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching preferences' });
  }
});

// 🛠️ Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.status(200).json({ message: 'Preferences updated', preferences: user.preferences });
  } catch (error) {
    console.error('Preferences update error:', error.message);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
});

// 📊 Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.stats);
  } catch (error) {
    console.error('Stats fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;
