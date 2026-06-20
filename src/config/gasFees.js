// Gas Fee Configuration
module.exports = {
  // Gas fee wallet on Base blockchain
  GAS_FEE_WALLET: '0xe401Ce54a66F8944706Ae928D144544ee3071556',
  
  // Gas fee percentage (0.5%)
  GAS_FEE_PERCENTAGE: 0.5,
  
  // Blockchain network
  BLOCKCHAIN_NETWORK: 'base',
  
  // Base RPC endpoint
  BASE_RPC_URL: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  
  // Gas fee tracking
  GAS_FEE_TRACKING: {
    enabled: true,
    logTransactions: true,
    batchProcessing: false, // Set to true for batch withdrawals
    batchSize: 10 // Number of fees to batch before withdrawal
  }
};
