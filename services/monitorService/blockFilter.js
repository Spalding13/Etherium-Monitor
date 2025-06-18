// blockFilter.js
class BlockFilter {
  /**
   * Process an array of blocks, filtering or handling their transactions.
   * @param {Array} blocks - Array of blocks with transactions
   * @returns {Array} filteredTransactions - Array of transactions after filtering
   */
  filter(blocks) {
    const filteredTransactions = [];

    for (const block of blocks) {
      for (const tx of block.transactions) {
        if (this.isTransactionRelevant(tx)) {
          filteredTransactions.push(tx);
        }
      }
    }

    return filteredTransactions;
  }

  /**
   * Customize this with your filtering logic.
   * @param {Object} tx - A transaction object
   * @returns {boolean} - Whether the transaction is relevant
   */
  isTransactionRelevant(tx) {
    // Example: filter transactions with value > 0
    return tx.value > 0n;
  }
}

module.exports = BlockFilter;
