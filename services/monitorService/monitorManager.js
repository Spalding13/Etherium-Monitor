const MonitorEth = require("./monitorWatcher");
const config = require('../configurationService/configurations/config_2_test.json');
const BlockFilter = require('./monitorFilter');
const TransactionSaver = require('./transactionSaver');
const EventEmitter = require('events');

class monitorManager extends EventEmitter{
  constructor(httpProvider, configManager) {
    super();

    // Singleton pattern to ensure only one instance of monitorManager exists
    if (monitorManager.instance) {
      return monitorManager.instance;
    }

    this.blockFilter = new BlockFilter(config);
    this.monitor = new MonitorEth(httpProvider);
    this.configManager = configManager;
    monitorManager.instance = this;


    // Listen for config updates
    this.configManager.on('configUpdated', (newConfig) => {
      this.handleConfigUpdate(newConfig);
    });
  }



  getEETTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Helsinki', // EET/EEST
      hour12: false                // 24-hour format
    });
  }

  logWithTimestamp(...args) {
    console.log(`[${this.getEETTime()}]`, ...args);
  }

  errorWithTimestamp(...args) {
    console.error(`[${this.getEETTime()}]`, ...args);
  }

  handleConfigUpdate(newConfig) {
    this.logWithTimestamp(`🔄 Configuration updated: ${newConfig.name}`)  
  }

  async start() {
    try {
      await this.monitor.initializeLastSyncedBlock();

      this.logWithTimestamp("🟢 Monitoring Ethereum transactions...");

      setInterval(async () => {
        try {
          this.logWithTimestamp("🔄 Checking for new transactions...");

          const blocksArray = await this.monitor.searchTransactions();

          if (Array.isArray(blocksArray) && blocksArray.length > 0) {
            const totalTxs = blocksArray.reduce((sum, block) => sum + block.transactions.length, 0);
            const filteredTxs = this.blockFilter.filter(blocksArray);

            this.logWithTimestamp(`Received ${blocksArray.length} block(s) containing ${totalTxs} transaction(s). 🍻`);
            this.logWithTimestamp(`Filtered ${filteredTxs.length} transaction(s) after applying filters. 🍺`);

            blocksArray.forEach((block) => {
              this.logWithTimestamp(`Block #${block.number} contains ${block.transactions.length} transaction(s).`);
            });

            TransactionSaver.saveTransactions(filteredTxs, config)
              .then(() => {
                this.logWithTimestamp(`✅ Successfully saved ${filteredTxs.length} transaction(s) to the database.`);
              })
              .catch((err) => {
                this.errorWithTimestamp("❌ Error saving transactions:", err);
              });
          } else {
            this.logWithTimestamp("No new blocks with transactions found.");
          }

          this.logWithTimestamp("✅ Check complete\n");
        } catch (err) {
          this.errorWithTimestamp("❌ Error during transaction search:", err);
        }
      }, 30 * 1000);

    } catch (error) {
      this.errorWithTimestamp("❌ Error starting monitor:", error);
    }
  }
}

module.exports = monitorManager;
