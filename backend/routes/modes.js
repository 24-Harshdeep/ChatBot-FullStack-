const express = require('express');
const router = express.Router();
const Mode = require('../models/Mode');

// Get all modes
router.get('/', async (req, res) => {
  try {
    const modes = await Mode.find();
    res.json(modes);
  } catch (error) {
    console.error('Get modes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific mode
router.get('/:name', async (req, res) => {
  try {
    const mode = await Mode.findOne({ name: req.params.name });
    if (!mode) {
      return res.status(404).json({ message: 'Mode not found' });
    }
    res.json(mode);
  } catch (error) {
    console.error('Get mode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
