// Enhanced Trading Controller with Gas Fees
const logger = require('../utils/logger');
const gasFeeService = require('../services/gasFeeService');

class TradeController {
  async executeTrade(req, res) {
    try {
      const { symbol, type, quantity, price } = req.body;
      
      if (!symbol || !type || !quantity || !price) {
        return res.status(400).json({ error: 'All trade fields required' });
      }

      if (quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: 'Quantity and price must be positive' });
      }
      
      logger.info(`Executing trade: ${type} ${quantity} ${symbol} at ${price}`);
      
      // Process trade with gas fees
      const grossAmount = quantity * price;
      const feeDetails = gasFeeService.calculateFee(grossAmount, symbol.split('/')[0]);
      
      // Create fee transaction
      const feeTransaction = await gasFeeService.createFeeTransaction(
        feeDetails.currency,
        feeDetails.feeAmount
      );
      
      // Execute trade with net amount
      const tradeId = 'trade_' + Date.now();
      const trade = {
        id: tradeId,
        symbol: symbol,
        type: type,
        quantity: quantity,
        price: price,
        grossAmount: feeDetails.grossAmount,
        gasFeeAmount: feeDetails.feeAmount,
        gasFeePercentage: feeDetails.feePercentage,
        netAmount: feeDetails.netAmount,
        feeWallet: feeDetails.feeWallet,
        feeTransaction: feeTransaction,
        timestamp: new Date(),
        status: 'executed',
        network: 'base'
      };

      logger.info(
        `Trade executed: ${tradeId} | Gross: ${feeDetails.grossAmount} ${feeDetails.currency} | Gas Fee: ${feeDetails.feeAmount} ${feeDetails.currency} | Net: ${feeDetails.netAmount} ${feeDetails.currency}`
      );
      
      res.status(201).json(trade);
    } catch (error) {
      logger.error(`Trade execution error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async getTradeHistory(req, res) {
    try {
      const userId = req.query.userId || 'user_123';
      
      logger.info(`Fetching trade history for user ${userId}`);
      
      // TODO: Implement actual database retrieval
      res.json({
        trades: [
          {
            id: 'trade_1',
            symbol: 'BTC/USD',
            type: 'BUY',
            quantity: 0.5,
            price: 45000,
            grossAmount: 22500,
            gasFeeAmount: 112.5,
            gasFeePercentage: 0.5,
            netAmount: 22387.5,
            feeWallet: '0xe401Ce54a66F8944706Ae928D144544ee3071556',
            timestamp: new Date(),
            network: 'base'
          }
        ],
        total: 1,
        totalGasFeesCollected: 112.5
      });
    } catch (error) {
      logger.error(`Trade history error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  async cancelTrade(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Trade ID required' });
      }
      
      logger.info(`Cancelling trade: ${id}`);
      
      // TODO: Implement actual trade cancellation logic
      res.json({
        message: 'Trade cancelled successfully',
        tradeId: id,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error(`Trade cancellation error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get gas fee statistics
   */
  async getGasFeeStatistics(req, res) {
    try {
      const stats = gasFeeService.getFeeStatistics();
      res.json(stats);
    } catch (error) {
      logger.error(`Gas fee statistics error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get accumulated fees
   */
  async getAccumulatedFees(req, res) {
    try {
      const fees = gasFeeService.getAccumulatedFees();
      res.json({
        accumulatedFees: fees,
        feeWallet: '0xe401Ce54a66F8944706Ae928D144544ee3071556',
        network: 'base',
        feePercentage: 0.5
      });
    } catch (error) {
      logger.error(`Accumulated fees error: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TradeController();
