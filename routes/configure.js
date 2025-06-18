const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration'); // assumes you have a Mongoose model

// GET all configurations
router.get('/', async (req, res) => {
  try {
    const configs = await Configuration.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch configurations' });
  }
});

// GET one configuration by configId
router.get('/:configId', async (req, res) => {
  try {
    const config = await Configuration.findOne({ configId: req.params.configId });
    if (!config) return res.status(404).json({ error: 'Configuration not found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// CREATE a new configuration
router.post('/', async (req, res) => {
  try {
    const config = new Configuration(req.body);
    await config.save();
    res.status(201).json(config);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create configuration', details: err.message });
  }
});

// UPDATE an existing configuration
router.put('/:configId', async (req, res) => {
  try {
    const updated = await Configuration.findOneAndUpdate(
      { configId: req.params.configId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Configuration not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update configuration', details: err.message });
  }
});

// DELETE a configuration
router.delete('/:configId', async (req, res) => {
  try {
    const deleted = await Configuration.findOneAndDelete({ configId: req.params.configId });
    if (!deleted) return res.status(404).json({ error: 'Configuration not found' });
    res.json({ message: 'Configuration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

module.exports = router;
