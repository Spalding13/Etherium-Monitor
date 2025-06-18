// blockFilter.js
class BlockFilter {
  constructor(config) {
    console.log("Initializing BlockFilter with config:", config);
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

    // Helper to safely convert to BigInt or return null if undefined
    const safeBigInt = (val) => (val !== undefined && val !== null) ? BigInt(val) : null;

    // 1. Block Number filter with custom odd rule
    const blockNumber = safeBigInt(tx.blockNumber);
    if (blockNumber === null) return false; // can't filter if no blockNumber

    if (f.blockNumber) {
      if (f.blockNumber.customRule === "odd" && (blockNumber % 2n === 0n)) {
        return false; // skip even block numbers
      }
      if (f.blockNumber.min && blockNumber < safeBigInt(f.blockNumber.min)) return false;
      if (f.blockNumber.max && blockNumber > safeBigInt(f.blockNumber.max)) return false;
    }

    // 2. Chain ID filter
    const chainId = safeBigInt(tx.chainId);
    if (f.chainId && chainId !== null && chainId !== safeBigInt(f.chainId)) return false;

    // 3. From address filter (if array non-empty)
    if (f.from && f.from.length > 0 && (!tx.from || !f.from.includes(tx.from.toLowerCase()))) return false;

    // 4. To address filter (if array non-empty)
    if (f.to && f.to.length > 0 && (!tx.to || !f.to.includes(tx.to.toLowerCase()))) return false;

    // 5. Gas price min filter
    const gasPrice = safeBigInt(tx.gasPrice);
    if (f.gasPrice && f.gasPrice.min && (gasPrice === null || gasPrice < safeBigInt(f.gasPrice.min))) return false;

    // 6. Value min filter
    const value = safeBigInt(tx.value);
    if (f.value && f.value.min && (value === null || value < safeBigInt(f.value.min))) return false;

    // 7. Input contains substring (if specified)
    if (f.inputContains && f.inputContains !== "" && (!tx.input || !tx.input.includes(f.inputContains))) return false;

    // 8. Transaction types filter
    if (f.transactionType && f.transactionType.length > 0) {
      const txTypeStr = tx.type !== undefined ? tx.type.toString() : null;
      if (!txTypeStr || !f.transactionType.includes(txTypeStr)) return false;
    }

    // 9. Nonce range min filter
    const nonce = safeBigInt(tx.nonce);
    if (f.nonceRange && f.nonceRange.min && (nonce === null || nonce < safeBigInt(f.nonceRange.min))) return false;

    // Passed all filters
    return true;
  }

}

module.exports = BlockFilter;
