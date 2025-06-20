const express = require('express')
const connectDB = require('./db/connect.js');
const app = express()
const port = 3000
const MonitorManager = require('./services/monitorService/monitorManager.js');
const configManager = require('./services/configurationService/configurationManager');

const populateDB = require('./scripts/insertConfigs.js'); // Import populateDB script

app.use(express.json());

//
const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";
const monitor = new MonitorManager(httpProvider, configManager);
monitor.start();

//  Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eth-monitor';
// const dropDB = require('./scripts/dropDB.js'); // Import dropDB script

connectDB(MONGO_URI);

const configureRouter = require('./routes/configure'); 
const monitorRouter = require('./routes/monitor');


app.use('/monitor', monitorRouter);
app.use('/configure', configureRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Monitor system listening on port ${port}`)
})