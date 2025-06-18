const MonitorEth = require("./monitorService");

const httpProvider = "https://mainnet.infura.io/v3/9a8ff5d2c82f4a41a71fbb8595b6722c";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    const monitor = new MonitorEth(httpProvider);
    await monitor.initializeLastSyncedBlock();

    console.log("🟢 Monitoring Ethereum transactions...");

    while (true) {
      try {
        console.log('🔄 Checking for new transactions...');
        await monitor.searchTransactions();
        console.log('✅ Check complete\n');
      } catch (err) {
        console.error('❌ Error during transaction search:', err);
      }
      await delay(30 * 1000); // wait 30 seconds before next check
    }
  } catch (error) {
    console.error("❌ Error starting monitor:", error);
  }
}

main();
