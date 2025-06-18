const { Web3 } = require('web3');

class MonitorEth {
  constructor(httpProvider) {
    this.web3 = new Web3(httpProvider);
    // Use BigInt zero here
    // Genesis block
    this.lastSyncedBlock = 0n;  
  }

  async initializeLastSyncedBlock() {
    // Convert Number to BigInt explicitly
    this.lastSyncedBlock = BigInt(await this.getLastBlockNumber());
  }

  async getBlock(blockNumber) {
    return this.web3.eth.getBlock(Number(blockNumber), true); // Convert BigInt to Number here
  }

  async getLastBlockNumber() {
    return this.web3.eth.getBlockNumber(); // Returns Number
  }

  async searchTransactions() {
    const lastBlockNumber = BigInt(await this.getLastBlockNumber());

    console.log(`Searching blocks: ${this.lastSyncedBlock + 1n} - ${lastBlockNumber}`);

    for (
      let blockNumber = this.lastSyncedBlock + 1n;
      blockNumber <= lastBlockNumber;
      blockNumber++
    ) {
      // web3.eth.getBlock expects Number, so convert BigInt -> Number
      const block = await this.getBlock(blockNumber);

      if (!block?.transactions) continue;

      for (const tx of block.transactions) {
        console.log("Found transaction:", tx);
      }
    }

    this.lastSyncedBlock = lastBlockNumber;
    console.log(`Finished searching up to block ${lastBlockNumber}`);
  }
}

module.exports = MonitorEth;
