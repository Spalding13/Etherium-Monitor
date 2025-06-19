const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration'); 
const ConfigManager = require('../services/configurationService/configurationManager');

// GET all configurations
router.get('/', async (req, res) => {
  console.log('GET / - Fetching all configurations');
  try {
    const configs = await Configuration.find();
    console.log(`GET / - Found ${configs.length} configurations`);
    res.json(configs);
  } catch (err) {
    console.error('GET / - Failed to fetch configurations:', err);
    res.status(500).json({ error: 'Failed to fetch configurations' });
  }
});

// GET one configuration by configId
router.get('/:configId', async (req, res) => {
  const { configId } = req.params;
  console.log(`GET /${configId} - Fetching configuration`);
  try {
    const config = await Configuration.findOne({ configId });
    if (!config) {
      console.warn(`GET /${configId} - Configuration not found`);
      return res.status(404).json({ error: 'Configuration not found' });
    }
    console.log(`GET /${configId} - Configuration found`);
    res.json(config);
  } catch (err) {
    console.error(`GET /${configId} - Failed to fetch configuration:`, err);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// CREATE a new configuration
router.post('/', async (req, res) => {
  const { configId } = req.body;
  console.log('POST / - Creating new configuration', { configId });
  try {
    if (!configId) {
      console.warn('POST / - Missing configId in request body');
      return res.status(400).json({ error: 'configId is required' });
    }

    const existingConfig = await Configuration.findOne({ configId });
    if (existingConfig) {
      console.warn(`POST / - Configuration with configId ${configId} already exists`);
      return res.status(409).json({ error: 'Configuration with this configId already exists' });
    }

    const config = new Configuration(req.body);
    await config.save();
    console.log(`POST / - Configuration ${configId} created successfully`);
    res.status(201).json(config);
  } catch (err) {
    console.error('POST / - Failed to create configuration:', err);
    res.status(400).json({ error: 'Failed to create configuration', details: err.message });
  }
});

// UPDATE an existing configuration
router.put('/:configId', async (req, res) => {
  const { configId } = req.params;
  console.log(`PUT /${configId} - Updating configuration`);
  try {
    const updated = await Configuration.findOneAndUpdate(
      { configId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      console.warn(`PUT /${configId} - Configuration not found`);
      return res.status(404).json({ error: 'Configuration not found' });
    }
    console.log(`PUT /${configId} - Configuration updated successfully`);
    res.json(updated);
  } catch (err) {
    console.error(`PUT /${configId} - Failed to update configuration:`, err);
    res.status(400).json({ error: 'Failed to update configuration', details: err.message });
  }
});

// DELETE a configuration
router.delete('/:configId', async (req, res) => {
  const { configId } = req.params;
  console.log(`DELETE /${configId} - Deleting configuration`);
  try {
    const deleted = await Configuration.findOneAndDelete({ configId });
    if (!deleted) {
      console.warn(`DELETE /${configId} - Configuration not found`);
      return res.status(404).json({ error: 'Configuration not found' });
    }
    console.log(`DELETE /${configId} - Configuration deleted successfully`);
    res.json({ message: 'Configuration deleted successfully' });
  } catch (err) {
    console.error(`DELETE /${configId} - Failed to delete configuration:`, err);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

// Activate a configuration by configId
router.patch('/activate/:configId', async (req, res) => {
  const { configId } = req.params;
  console.log(`PATCH /activate/${configId} - Activating configuration`);
  try {
    const config = await Configuration.findOne({ configId });
    if (!config) {
      console.warn(`PATCH /activate/${configId} - Configuration not found`);
      return res.status(404).json({ error: 'Configuration not found' });
    }
    if (config.active) {
      console.warn(`PATCH /activate/${configId} - Configuration is already active`);
      return res.status(400).json({ error: 'Configuration is already active' });
    }

    await ConfigManager.setActiveConfig(configId);

    console.log(`PATCH /activate/${configId} - Configuration activated successfully`);
    res.json({ message: `Configuration ${configId} activated successfully.` });
  } catch (error) {
    console.error(`PATCH /activate/${configId} - Error activating configuration:`, error);
    res.status(500).json({ error: 'Failed to activate configuration' });
  }
});

module.exports = router;
