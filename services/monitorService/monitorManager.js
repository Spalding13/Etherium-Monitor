const MonitorEth = require("./monitorWatcher");

const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";

async function main() {
  try {
    const monitor = new MonitorEth(httpProvider);
    await monitor.initializeLastSyncedBlock();

    console.log("🟢 Monitoring Ethereum transactions...");

    // Run the check every 30 seconds
    setInterval(async () => {
      try {
        console.log('🔄 Checking for new transactions...');
        
        const blocks = await monitor.searchTransactions();
        
        // Log the return type
        console.log('Return type of searchTransactions:', typeof blocks);
        
        // Log whether you received blocks and how many
        if (Array.isArray(blocks)) {
          console.log(`Received ${blocks.length} block(s) from watcher.`);
        } else {
          console.log('Received unexpected data:', blocks);
        }

        console.log('✅ Check complete\n');
      } catch (err) {
        console.error('❌ Error during transaction search:', err);
      }
    }, 10 * 1000); // 30 seconds interval
  } catch (error) {
    console.error("❌ Error starting monitor:", error);
  }
}

main();
