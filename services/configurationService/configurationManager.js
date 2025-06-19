const EventEmitter = require('events');
const mongoose = require('mongoose');
const Configuration = require('../../models/configuration');

class ConfigurationManager extends EventEmitter {
  constructor() {
    super();
    this.activeConfig = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.activeConfig = await Configuration.findOne({ active: true });
    this.initialized = true;
    if (this.activeConfig) {
      this.emit('configUpdated', this.activeConfig);
    }
  }

  getActiveConfig() {
    return this.activeConfig;
  }

  async setActiveConfig(configId) {
    if (!configId) throw new Error('configId is required');

    const newConfig = await Configuration.findOne({ configId });

    if (!newConfig) {
      throw new Error('Configuration not found');
    }

    // If the requested config is already active, skip updates
    if (this.activeConfig && this.activeConfig.configId === configId) {
      return newConfig;
    }

    // Deactivate all currently active configurations

    await Configuration.updateMany({ active: true }, { $set: { active: false } });

    // Activate the new configuration
    newConfig.active = true;
    console.log(`📃 Activating configuration: ${newConfig.configId}`);
    await newConfig.save();

    this.activeConfig = newConfig;

    this.emit('configUpdated', newConfig);

    return newConfig;
  }

}

// Export a single shared instance (singleton)
module.exports = new ConfigurationManager();
