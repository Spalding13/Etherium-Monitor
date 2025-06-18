const express = require('express');
const router = express.Router();
const monitorService = require('../services/monitorService/monitorManager');
const Transaction = require('../models/transaction'); // Assuming you have a Mongoose model for transactions

// Monitor routes
// This file defines the routes for the monitor system
router.get('/', (req, res) => {
  res.send('Monitor Home');
});

router.get('/stored_tx_amount', async (req, res) => {
  try {
    const numberOfTransactions = await Transaction.countDocuments({});
    res.json({ numberOfTransactions });
  } catch (err) {
    console.error('Error fetching transaction count:', err);
    res.status(500).json({ error: 'Failed to fetch transaction count' });
  }
});


router.get('/all_transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;