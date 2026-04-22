const express = require('express');
const Field = require('../models/Field');
const FieldUpdate = require('../models/FieldUpdate');
const { auth, adminAuth, agentAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate field status
const calculateFieldStatus = (field) => {
  const today = new Date();
  const plantingDate = new Date(field.planting_date);
  const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
  
  // Status logic based on stage and time
  if (field.current_stage === 'harvested') {
    return 'completed';
  } else if (field.current_stage === 'planted' && daysSincePlanting > 30) {
    return 'at_risk'; // Planted too long without growth
  } else if (field.current_stage === 'growing' && daysSincePlanting > 120) {
    return 'at_risk'; // Growing too long without being ready
  } else if (field.current_stage === 'ready' && daysSincePlanting > 150) {
    return 'at_risk'; // Ready too long without harvest
  } else {
    return 'active';
  }
};

// Get all fields (admin) or assigned fields (agent)
router.get('/', auth, async (req, res) => {
  try {
    let fields;
    if (req.user.role === 'admin') {
      fields = await Field.getAll();
    } else {
      fields = await Field.getByAgentId(req.user.id);
    }
    
    // Calculate and update status for each field
    const fieldsWithStatus = fields.map(field => ({
      ...field,
      status: calculateFieldStatus(field)
    }));
    
    res.json(fieldsWithStatus);
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get field statistics
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    let stats;
    if (req.user.role === 'admin') {
      stats = await Field.getStats();
    } else {
      stats = await Field.getStatsByAgent(req.user.id);
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Get field stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get field by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const field = await Field.getById(req.params.id);
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    // Check access permissions
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Calculate status
    field.status = calculateFieldStatus(field);
    
    res.json(field);
  } catch (error) {
    console.error('Get field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new field (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
    
    // Validate input
    if (!name || !crop_type || !planting_date || !current_stage) {
      return res.status(400).json({ message: 'Name, crop type, planting date, and current stage are required' });
    }
    
    const validStages = ['planted', 'growing', 'ready', 'harvested'];
    if (!validStages.includes(current_stage)) {
      return res.status(400).json({ message: 'Invalid current stage' });
    }
    
    // Calculate initial status
    const fieldData = { name, crop_type, planting_date, current_stage, assigned_agent_id };
    const status = calculateFieldStatus(fieldData);
    
    const field = await Field.create({
      ...fieldData,
      status
    });
    
    res.status(201).json(field);
  } catch (error) {
    console.error('Create field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update field (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
    
    // Validate input
    if (!name || !crop_type || !planting_date || !current_stage) {
      return res.status(400).json({ message: 'Name, crop type, planting date, and current stage are required' });
    }
    
    const validStages = ['planted', 'growing', 'ready', 'harvested'];
    if (!validStages.includes(current_stage)) {
      return res.status(400).json({ message: 'Invalid current stage' });
    }
    
    // Calculate status
    const fieldData = { name, crop_type, planting_date, current_stage, assigned_agent_id };
    const status = calculateFieldStatus(fieldData);
    
    const field = await Field.update(req.params.id, {
      ...fieldData,
      status
    });
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json(field);
  } catch (error) {
    console.error('Update field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete field (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const field = await Field.delete(req.params.id);
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    res.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Delete field error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update field stage (agent can update assigned fields, admin can update any)
router.put('/:id/stage', auth, agentAuth, async (req, res) => {
  try {
    const { stage, notes } = req.body;
    
    if (!stage) {
      return res.status(400).json({ message: 'Stage is required' });
    }
    
    const validStages = ['planted', 'growing', 'ready', 'harvested'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage' });
    }
    
    // Get field to check permissions
    const field = await Field.getById(req.params.id);
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    // Check access permissions
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Create field update record
    await FieldUpdate.create({
      field_id: req.params.id,
      agent_id: req.user.id,
      stage,
      notes
    });
    
    // Calculate new status
    const plantingDate = new Date(field.planting_date);
    const tempFieldData = { ...field, current_stage: stage, planting_date: plantingDate };
    const status = calculateFieldStatus(tempFieldData);
    
    // Update field stage and status in one call
    const updatedField = await Field.update(req.params.id, {
      name: field.name,
      crop_type: field.crop_type,
      planting_date: field.planting_date,
      current_stage: stage,
      status: status,
      assigned_agent_id: field.assigned_agent_id
    });
    
    res.json(updatedField);
  } catch (error) {
    console.error('Update field stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get field updates
router.get('/:id/updates', auth, async (req, res) => {
  try {
    const field = await Field.getById(req.params.id);
    
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }
    
    // Check access permissions
    if (req.user.role !== 'admin' && field.assigned_agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = await FieldUpdate.getByFieldId(req.params.id);
    res.json(updates);
  } catch (error) {
    console.error('Get field updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agent's field updates
router.get('/updates/agent/:agentId', auth, async (req, res) => {
  try {
    const updates = await FieldUpdate.getByAgentId(req.params.agentId);
    res.json(updates);
  } catch (error) {
    console.error('Get agent updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
