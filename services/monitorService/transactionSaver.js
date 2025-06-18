const Transaction = require("../../models/transaction");

class TransactionSaver {
  /**
   * Saves an array of Ethereum transactions.
   * @param {Array<Object>} transactions - Array of transaction objects (from web3).
   */
  static async saveTransactions(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      console.log("⚠️ No transactions to save.");
      return;
    }

    const docs = transactions.map(this.prepareTransaction);

    try {
      const result = await Transaction.insertMany(docs, { ordered: false });
      console.log(`✅ Saved ${result.length} transaction(s) to the database.`);
    } catch (err) {
      if (err.writeErrors) {
        const successful = err.result?.nInserted || 0;
        console.warn(`⚠️ Partial insert: ${successful} transaction(s) saved. Some duplicates or issues occurred.`);
      } else {
        console.error("❌ Failed to save transactions:", err);
      }
    }
  }

  /**
   * Prepares a transaction for saving: converts BigInts to strings.
   * @param {Object} tx - A raw transaction object from web3.
   * @returns {Object} MongoDB-compatible document.
   */
  static prepareTransaction(tx) {
    return {
      accessList: tx.accessList || [],
      blockHash: tx.blockHash,
      blockNumber: String(tx.blockNumber),
      chainId: String(tx.chainId),
      from: tx.from,
      gas: String(tx.gas),
      gasPrice: String(tx.gasPrice),
      hash: tx.hash,
      input: tx.input,
      maxFeePerGas: String(tx.maxFeePerGas),
      maxPriorityFeePerGas: String(tx.maxPriorityFeePerGas),
      nonce: String(tx.nonce),
      r: tx.r,
      s: tx.s,
      to: tx.to || null,
      transactionIndex: String(tx.transactionIndex),
      type: String(tx.type),
      v: String(tx.v),
      value: String(tx.value),
    };
  }
}

module.exports = TransactionSaver;
