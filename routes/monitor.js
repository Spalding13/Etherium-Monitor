const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send('Monitor Home');
});

router.get('/status', (req, res) => {
  res.send('System Status: OK');
});

module.exports = router;