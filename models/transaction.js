const mongoose = require('mongoose');


// TODO: Figure out a way to bypass no native support for BigInt
// currently BigInt is converted to string
const transactionSchema = new mongoose.Schema({
  accessList: {
    type: [mongoose.Schema.Types.Mixed], 
    default: []
  },
  blockHash: { type: String, required: true },
  blockNumber: { type: String, required: true }, // store BigInt as string
  chainId: { type: String, required: true },     // BigInt as string
  from: { type: String, required: true },
  gas: { type: String, required: true },         // BigInt as string
  gasPrice: { type: String, required: true },    // BigInt as string
  hash: { type: String, required: true, unique: true },
  input: { type: String, required: true },
  maxFeePerGas: { type: String, required: true },        // BigInt as string
  maxPriorityFeePerGas: { type: String, required: true },// BigInt as string
  nonce: { type: String, required: true },                // BigInt as string
  r: { type: String, required: true },
  s: { type: String, required: true },
  to: { type: String, required: false },      // 'to' can be null in contract creation tx
  transactionIndex: { type: String, required: true }, // BigInt as string
  type: { type: String, required: true },     // BigInt as string
  v: { type: String, required: true },        // BigInt as string
  value: { type: String, required: true },    // BigInt as string
  configId: { type: String, required: true }, // this is reference to Configuration
  createdAt: { type: Date, default: Date.now } // for tracking when the transaction was created
}, {
  timestamps: true // optional: adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Transactions', transactionSchema);
