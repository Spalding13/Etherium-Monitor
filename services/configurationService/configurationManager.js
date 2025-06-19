const Configuration = require('./models/configuration');

class ConfigurationManager {
  constructor(monitorManager) {
    this.monitorManager = monitorManager;
    this.activeConfig = null;
    this.initialized = false;
  }

  // Initialize by loading active config from DB at app start
  async init() {
    if (this.initialized) return;
    this.activeConfig = await Configuration.findOne({ active: true });
    this.initialized = true;
    if (this.activeConfig) {
      this.monitorManager.updateConfig(this.activeConfig);
    }
  }

  // Get currently active config (cached)
  getActiveConfig() {
    return this.activeConfig;
  }

  // Activate a new config by ID
  async setActiveConfig(configId) {
    // Load the config from DB
    const newConfig = await Configuration.findOne({ configId });
    if (!newConfig) {
      throw new Error('Configuration not found');
    }

    // If already active, no action
    if (this.activeConfig && this.activeConfig.configId === configId) {
      return;
    }

    // Transactionally update DB: deactivate old active, activate new one
    await Configuration.updateMany({ active: true }, { $set: { active: false } });
    newConfig.active = true;
    await newConfig.save();

    // Update internal cache
    this.activeConfig = newConfig;

    // Notify monitorManager immediately
    this.monitorManager.updateConfig(newConfig);
  }
}

module.exports = ConfigurationManager;
