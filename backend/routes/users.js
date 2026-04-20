const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all field agents (admin only)
router.get('/agents', auth, adminAuth, async (req, res) => {
  try {
    const agents = await User.getAgents();
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
