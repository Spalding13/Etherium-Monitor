const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const configurationSchema = new mongoose.Schema({
    name:String,
    description: String,
    configId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4 // Auto-generate if not provided
  },
  filter: {
    blockNumber: {
      customRule: { type: String, enum: ['odd', 'even'], required: false },
      min: { type: String, required: true }, // Stored as string to handle big numbers
      max: { type: String, required: true }
    },
    chainId: {
      type: String,
      required: true
    },
    from: {
      type: [String],
      default: []
    },
    to: {
      type: [String],
      default: []
    },
    gasPrice: {
      min: { type: String, required: true }
    },
    value: {
      min: { type: String, required: true }
    },
    inputContains: {
      type: String,
      default: ""
    },
    transactionType: {
      type: [String],
      enum: ['0', '1', '2'],
      required: true
    },
    nonceRange: {
      min: { type: String, required: true }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Configuration', configurationSchema);
