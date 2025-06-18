const express = require('express')
const connectDB = require('./db/connect.js');
const app = express()
const port = 3000

//  Database connection

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ethMonitor';
connectDB(MONGO_URI);


const monitorRouter = require('./routes/monitor');

app.use('/monitor', monitorRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Monitor system listening on port ${port}`)
})