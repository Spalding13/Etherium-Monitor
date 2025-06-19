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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newConfig = await Configuration.findOne({ configId }).session(session);
      if (!newConfig) {
        throw new Error('Configuration not found');
      }

      if (this.activeConfig && this.activeConfig.configId === configId) {
        await session.abortTransaction();
        session.endSession();
        return; // Already active
      }

      await Configuration.updateMany({ active: true }, { $set: { active: false } }).session(session);

      newConfig.active = true;
      await newConfig.save({ session });

      await session.commitTransaction();
      session.endSession();

      this.activeConfig = newConfig;

      this.emit('configUpdated', newConfig);

      return newConfig;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

// Export a single shared instance (singleton)
module.exports = new ConfigurationManager();
