// blockFilter.js
class BlockFilter {
  constructor(config) {
    this.config = config;
  }

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
   * Applies filtering rules based on config.
   * @param {Object} tx - A transaction object
   * @returns {boolean} - Whether the transaction is relevant
   */
  isTransactionRelevant(tx) {
    const f = this.config.filter;

    // 1. Block Number filter with custom odd rule
    const blockNumber = BigInt(tx.blockNumber);
    if (f.blockNumber) {
      if (f.blockNumber.customRule === "odd" && (blockNumber % 2n === 0n)) {
        return false; // skip even block numbers
      }
      if (f.blockNumber.min && blockNumber < BigInt(f.blockNumber.min)) return false;
      if (f.blockNumber.max && blockNumber > BigInt(f.blockNumber.max)) return false;
    }

    // 2. Chain ID filter
    if (f.chainId && BigInt(tx.chainId) !== BigInt(f.chainId)) return false;

    // 3. From address filter (if array non-empty)
    if (f.from && f.from.length > 0 && !f.from.includes(tx.from.toLowerCase())) return false;

    // 4. To address filter (if array non-empty)
    if (f.to && f.to.length > 0 && !f.to.includes(tx.to.toLowerCase())) return false;

    // 5. Gas price min filter
    if (f.gasPrice && f.gasPrice.min && BigInt(tx.gasPrice) < BigInt(f.gasPrice.min)) return false;

    // 6. Value min filter
    if (f.value && f.value.min && BigInt(tx.value) < BigInt(f.value.min)) return false;

    // 7. Input contains substring (if specified)
    if (f.inputContains && f.inputContains !== "" && !tx.input.includes(f.inputContains)) return false;

    // 8. Transaction types filter
    if (f.transactionType && f.transactionType.length > 0) {
      const txTypeStr = tx.type.toString();
      if (!f.transactionType.includes(txTypeStr)) return false;
    }

    // 9. Nonce range min filter
    if (f.nonceRange && f.nonceRange.min && BigInt(tx.nonce) < BigInt(f.nonceRange.min)) return false;

    // Passed all filters
    return true;
  }
}

module.exports = BlockFilter;
