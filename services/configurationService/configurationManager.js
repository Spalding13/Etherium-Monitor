const EventEmitter = require('events');
const mongoose = require('mongoose');
const Configuration = require('../../models/configuration');
// Fallback configuration for testing purposes
const config = require('../configurationService/configurations/config_2_test.json');

class ConfigurationManager extends EventEmitter {
  constructor() {
    super();
    this.activeConfig = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    console.log('🔍 Looking for active config in DB...');
    this.activeConfig = await Configuration.findOne({ active: true }) || config;
    this.initialized = true;
    if (this.activeConfig) {
      this.emit('configUpdated', this.activeConfig);
    }
    console.log('✅ ConfigurationManager initialized with active configuration:', this.activeConfig ? this.activeConfig.name : 'None');
   
  }

  getActiveConfig() {
    return this.activeConfig;
  }

  async setActiveConfig(configId) {

    const newConfig = await Configuration.findOne({ configId });

    if (!newConfig) {
      throw new Error('❌ Configuration not found');
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

    // Emit an event to notify monitor Manager of the new active configuration
    console.log(`✅ Configuration ${newConfig.name} is now active.`);
    this.emit('configUpdated', newConfig);

    return newConfig;
  }

}

// Export a singleton instance
module.exports = new ConfigurationManager();