const MonitorEth = require("./monitorWatcher");

const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";


const config = require('./configurations/config_1.json');
const BlockFilter = require('./monitorFilter');
const blockFilter = new BlockFilter(config);


async function main() {
  try {
    const monitor = new MonitorEth(httpProvider);
    await monitor.initializeLastSyncedBlock();

    console.log("🟢 Monitoring Ethereum transactions...");

    // Run the check every 30 seconds
    // TODO: Figure out how to use node-cron 
    // for production environemnt.
    setInterval(async () => {
  try {
    console.log('🔄 Checking for new transactions...');

    const blocksArray = await monitor.searchTransactions();

    if (Array.isArray(blocksArray) && blocksArray.length > 0) {
      // Total number of transactions across all blocks
      const totalTxs = blocksArray.reduce((sum, block) => sum + block.transactions.length, 0);

      // Filter the transactions (assuming your filter accepts array of blocks)
      const filteredTxs = blockFilter.filter(blocksArray);

      console.log(`Received ${blocksArray.length} block(s) containing ${totalTxs} transaction(s). 🍻`);
      console.log(`Filtered ${filteredTxs.length} transaction(s) after applying filters. 🍺`);

      // Optional: log block-wise transaction count
      blocksArray.forEach((block) => {
        console.log(`Block #${block.number} contains ${block.transactions.length} transaction(s).`);
      });
    } else {
      console.log('No new blocks with transactions found.');
    }

    console.log('✅ Check complete\n');
  } catch (err) {
    console.error('❌ Error during transaction search:', err);
  }
    }, 30 * 1000);

  } catch (error) {
    console.error("❌ Error starting monitor:", error);
  }
}

main();
