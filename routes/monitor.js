const express = require('express');
const router = express.Router();
const monitorService = require('../services/monitorService/monitorManager');


// Monitor routes
// This file defines the routes for the monitor system
router.get('/', (req, res) => {
  res.send('Monitor Home');
});

router.get('/status', (req, res) => {
  res.send('System Status: OK');
});

module.exports = router;