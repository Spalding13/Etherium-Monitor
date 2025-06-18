const express = require('express')
const connectDB = require('./db/connect.js');
const app = express()
const port = 3000
//const populateDB = require('./scripts/insertConfigs.js'); // Import populateDB script

app.use(express.json());

// const dropDB = require('./scripts/dropDB.js'); // Import dropDB script

//  Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ethMonitor';
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