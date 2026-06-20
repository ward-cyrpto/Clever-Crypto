// Gas Fee Service for handling trade fees and wallet transfers
const logger = require('../utils/logger');
const gasConfig = require('../config/gasFees');

class GasFeeService {
  constructor() {
    this.feeWallet = gasConfig.GAS_FEE_WALLET;
    this.feePercentage = gasConfig.GAS_FEE_PERCENTAGE;
    this.accumulatedFees = {}; // Track accumulated fees by currency
  }

  /**
   * Calculate gas fee for a trade
   * @param {number} tradeAmount - Total trade amount
   * @param {string} currency - Trade currency (BTC, ETH, etc.)
   * @returns {object} Fee details
   */
  calculateFee(tradeAmount, currency) {
    const feeAmount = (tradeAmount * this.feePercentage) / 100;
    const netAmount = tradeAmount - feeAmount;

    return {
      grossAmount: tradeAmount,
      feeAmount: parseFloat(feeAmount.toFixed(8)),
      netAmount: parseFloat(netAmount.toFixed(8)),
      feePercentage: this.feePercentage,
      currency: currency,
      feeWallet: this.feeWallet,
      timestamp: new Date(),
      gasNetwork: gasConfig.BLOCKCHAIN_NETWORK
    };
  }

  /**
   * Process trade with gas fees
   * @param {object} tradeData - Trade information
   * @returns {object} Trade with fee details
   */
  processTradeWithFees(tradeData) {
    const { symbol, type, quantity, price } = tradeData;
    const tradeAmount = quantity * price;
    const currency = symbol.split('/')[0]; // Extract currency (e.g., BTC from BTC/USD)

    const feeDetails = this.calculateFee(tradeAmount, currency);

    logger.info(
      `Gas fee calculated: ${feeDetails.feeAmount} ${currency} (${this.feePercentage}%) from trade ${symbol}`
    );

    // Track accumulated fees
    if (!this.accumulatedFees[currency]) {
      this.accumulatedFees[currency] = 0;
    }
    this.accumulatedFees[currency] += feeDetails.feeAmount;

    return {
      ...tradeData,
      feeDetails: feeDetails,
      netExecutionAmount: feeDetails.netAmount
    };
  }

  /**
   * Get accumulated fees
   * @returns {object} Accumulated fees by currency
   */
  getAccumulatedFees() {
    return this.accumulatedFees;
  }

  /**
   * Create blockchain transaction for fee transfer
   * @param {string} currency - Currency of the fee
   * @param {number} amount - Fee amount
   * @returns {object} Transaction details
   */
  async createFeeTransaction(currency, amount) {
    try {
      const txData = {
        from: 'trading_platform',
        to: this.feeWallet,
        value: amount,
        currency: currency,
        network: gasConfig.BLOCKCHAIN_NETWORK,
        type: 'gas_fee_transfer',
        status: 'pending',
        createdAt: new Date(),
        // TODO: Integrate with actual blockchain RPC
        // This is a placeholder for actual blockchain integration
        transactionHash: this.generateTransactionHash()
      };

      logger.info(`Fee transaction created: ${amount} ${currency} to ${this.feeWallet}`);
      return txData;
    } catch (error) {
      logger.error(`Failed to create fee transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate placeholder transaction hash
   * @returns {string} Transaction hash
   */
  generateTransactionHash() {
    return '0x' + Math.random().toString(16).substr(2);
  }

  /**
   * Verify fee wallet address
   * @param {string} wallet - Wallet address to verify
   * @returns {boolean} Is valid Base wallet address
   */
  isValidWalletAddress(wallet) {
    return /^0x[a-fA-F0-9]{40}$/.test(wallet);
  }

  /**
   * Get fee statistics
   * @returns {object} Fee statistics
   */
  getFeeStatistics() {
    const totalFees = Object.values(this.accumulatedFees).reduce((sum, val) => sum + val, 0);
    return {
      feeWallet: this.feeWallet,
      feePercentage: this.feePercentage,
      accumulatedFees: this.accumulatedFees,
      totalFeesCombined: parseFloat(totalFees.toFixed(8)),
      network: gasConfig.BLOCKCHAIN_NETWORK,
      timestamp: new Date()
    };
  }

  /**
   * Reset accumulated fees (after batch withdrawal)
   */
  resetAccumulatedFees() {
    this.accumulatedFees = {};
    logger.info('Accumulated fees reset after withdrawal');
  }
}

module.exports = new GasFeeService();
