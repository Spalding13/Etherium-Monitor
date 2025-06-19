const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration'); 
const ConfigManager = require('../services/configurationService/configurationManager');

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
    const { configId } = req.body;

    if (!configId) {
      return res.status(400).json({ error: 'configId is required' });
    }

    // Check if a config with the same configId already exists
    const existingConfig = await Configuration.findOne({ configId });
    if (existingConfig) {
      return res.status(409).json({ error: 'Configuration with this configId already exists' });
    }

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

// Activate a configuration by configId
router.patch('/activate/:configId', async (req, res) => {
  try {
    const { configId } = req.params;

    // Find the config in DB
    const config = await Configuration.findOne({ configId });
    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    // Activate the configuration via your manager
    await ConfigManager.setActiveConfig(config);

    res.json({ message: `Configuration ${configId} activated successfully.` });
  } catch (error) {
    console.error('Error activating configuration:', error);
    res.status(500).json({ error: 'Failed to activate configuration' });
  }
});

module.exports = router;
