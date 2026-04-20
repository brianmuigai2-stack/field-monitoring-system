const express = require('express');
const FieldUpdate = require('../models/FieldUpdate');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get recent field updates (admin)
router.get('/recent', auth, async (req, res) => {
  try {
    const updates = await FieldUpdate.getRecent(20);
    res.json(updates);
  } catch (error) {
    console.error('Get recent updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agent's field updates
router.get('/agent/:agentId', auth, async (req, res) => {
  try {
    const updates = await FieldUpdate.getByAgentId(req.params.agentId);
    res.json(updates);
  } catch (error) {
    console.error('Get agent updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
