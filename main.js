const express = require('express');
const connectDB = require('./db/connect.js');
const populateDB = require('./scripts/insertConfigs.js');
const app = express();
const port = 3000;

const configureRouter = require('./routes/configure'); 
const monitorRouter = require('./routes/monitor');

mongo_remote_uri = "mongodb+srv://ilianlalov:rSB70y9KfyaTUOBu@cluster0.7lnmtoq.mongodb.net/eth-monitor?retryWrites=true&w=majority&appName=Cluster0"

//const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eth-monitor';
const MONGO_URI = mongo_remote_uri;

app.use(express.json());

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);

    // Attempt to populate the database
    await populateDB(MONGO_URI);
    
    // Initialize configManager after populating the database
    const configManager = require('./services/configurationService/configurationManager');

    // Initialize and wait for configManager
    await configManager.init();
    
    // MonitorManager only after configManager is ready
    const MonitorManager = require('./services/monitorService/monitorManager.js');
    const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";
    const monitor = new MonitorManager(httpProvider, configManager);
    monitor.start();

    // Set up routes
    app.use('/monitor', monitorRouter);
    app.use('/configure', configureRouter);

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // Start listening
    app.listen(port, () => {
      console.log(`🚀 Monitor system listening on port ${port}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
