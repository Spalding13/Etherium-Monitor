const mongoose = require('mongoose');
const Configuration = require('../models/configuration');
const { v4: uuidv4 } = require('uuid');

const configs = [
    {
        "name": "Monitor ETH Transfers",
        "description": "Monitor all ETH transfers",
        "filter": {
            "blockNumber": { "customRule": "odd", "min": "1", "max": "999999999999" },
            "chainId": "1",
            "from": [],
            "to": [],
            "gasPrice": { "min": "1000000000" },
            "value": { "min": "0" },
            "inputContains": "",
            "transactionType": ["0", "1"],
            "nonceRange": { "min": "0" }
        }
    },
    {
        "name": "Stablecoin Watcher",
        "description": "Watch for large stablecoin transfers",
        "filter": {
            "blockNumber": { "customRule": "even", "min": "10", "max": "100000000" },
            "chainId": "1",
            "from": [],
            "to": [],
            "gasPrice": { "min": "1000000000" },
            "value": { "min": "1000000000000000000" },
            "inputContains": "",
            "transactionType": ["2"],
            "nonceRange": { "min": "0" }
        } 
    },
    {
        "name": "Contract Interactions",
        "description": "Track all contract calls",
        "filter": {
            "blockNumber": { "customRule": "odd", "min": "1", "max": "88888888" },
            "chainId": "1",
            "from": [],
            "to": [],
            "gasPrice": { "min": "1000000000" },
            "value": { "min": "0" },
            "inputContains": "0x",
            "transactionType": ["1", "2"],
            "nonceRange": { "min": "0" }
        }
    }
];

async function insertData() {
  await mongoose.connect('mongodb://localhost:27017/eth-monitor');
  for (let cfg of configs) {
    cfg.configId = uuidv4(); // Ensure unique id
    await Configuration.create(cfg);
  }
  console.log('Inserted configurations.');
}

insertData().catch(console.error);
