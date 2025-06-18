const MonitorEth = require("./monitorWatcher");
const config = require('./configurations/config_2_test.json');
const BlockFilter = require('./monitorFilter');
const TransactionSaver = require('./transactionSaver');

const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";
const blockFilter = new BlockFilter(config);

function getEETTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Helsinki', // EET/EEST
    hour12: false                // 24-hour format
  });
}

function logWithTimestamp(...args) {
  console.log(`[${getEETTime()}]`, ...args);
}

function errorWithTimestamp(...args) {
  console.error(`[${getEETTime()}]`, ...args);
}

async function processTransactions() {
  try {
    const monitor = new MonitorEth(httpProvider);
    await monitor.initializeLastSyncedBlock();

    logWithTimestamp("🟢 Monitoring Ethereum transactions...");

    // Run the check every 30 seconds
    // TODO: Use node-cron in production
    setInterval(async () => {
      try {
        logWithTimestamp("🔄 Checking for new transactions...");

        const blocksArray = await monitor.searchTransactions();

        if (Array.isArray(blocksArray) && blocksArray.length > 0) {
          // Total number of transactions across all blocks
          const totalTxs = blocksArray.reduce((sum, block) => sum + block.transactions.length, 0);

          // Filter the transactions
          const filteredTxs = blockFilter.filter(blocksArray);

          logWithTimestamp(`Received ${blocksArray.length} block(s) containing ${totalTxs} transaction(s). 🍻`);
          logWithTimestamp(`Filtered ${filteredTxs.length} transaction(s) after applying filters. 🍺`);

          // Block-wise transaction count
          blocksArray.forEach((block) => {
            logWithTimestamp(`Block #${block.number} contains ${block.transactions.length} transaction(s).`);
          });

          // Save filtered transactions to the database
          TransactionSaver.saveTransactions(filteredTxs, config)
            .then(() => {
              logWithTimestamp(`✅ Successfully saved ${filteredTxs.length} transaction(s) to the database.`);
            })
            .catch((err) => {
              errorWithTimestamp("❌ Error saving transactions:", err);
            });
        } else {
          logWithTimestamp("No new blocks with transactions found.");
        }

        logWithTimestamp("✅ Check complete\n");
      } catch (err) {
        errorWithTimestamp("❌ Error during transaction search:", err);
      }
    }, 10 * 1000);
  } catch (error) {
    errorWithTimestamp("❌ Error starting monitor:", error);
  }
}

processTransactions();
