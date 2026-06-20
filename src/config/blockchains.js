# Multi-Blockchain Support Configuration

module.exports = {
  // Supported blockchains
  blockchains: {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      chainId: null,
      rpcUrl: process.env.BITCOIN_RPC_URL || 'https://blockchain.info/q',
      explorer: 'https://blockchain.com/btc/tx',
      enabled: true
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      rpcUrl: process.env.ETH_RPC_URL || 'https://eth.public.rpc.thirdweb.com',
      explorer: 'https://etherscan.io/tx',
      enabled: true
    },
    base: {
      name: 'Base',
      symbol: 'BASE',
      chainId: 8453,
      rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      explorer: 'https://basescan.org/tx',
      enabled: true,
      primary: true
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com/tx',
      enabled: true
    },
    bsc: {
      name: 'Binance Smart Chain',
      symbol: 'BSC',
      chainId: 56,
      rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org',
      explorer: 'https://bscscan.com/tx',
      enabled: true
    },
    arbitrum: {
      name: 'Arbitrum',
      symbol: 'ARB',
      chainId: 42161,
      rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      explorer: 'https://arbiscan.io/tx',
      enabled: true
    },
    optimism: {
      name: 'Optimism',
      symbol: 'OP',
      chainId: 10,
      rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
      explorer: 'https://optimistic.etherscan.io/tx',
      enabled: true
    },
    avalanche: {
      name: 'Avalanche',
      symbol: 'AVAX',
      chainId: 43114,
      rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
      explorer: 'https://snowtrace.io/tx',
      enabled: true
    },
    solana: {
      name: 'Solana',
      symbol: 'SOL',
      chainId: null,
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      explorer: 'https://explorer.solana.com/tx',
      enabled: true
    },
    xrpl: {
      name: 'XRP Ledger',
      symbol: 'XRP',
      chainId: null,
      rpcUrl: process.env.XRPL_RPC_URL || 'https://xrpl.ws',
      explorer: 'https://xrpscan.com/tx',
      enabled: true
    }
  },

  gasFees: {
    percentage: 0.5,
    wallet: '0xe401Ce54a66F8944706Ae928D144544ee3071556',
    trackingEnabled: true
  },

  getEnabledBlockchains() {
    return Object.values(this.blockchains).filter(bc => bc.enabled);
  },

  getBlockchainBySymbol(symbol) {
    return Object.values(this.blockchains).find(bc => bc.symbol === symbol);
  },

  getBlockchainByName(name) {
    return Object.values(this.blockchains).find(bc => bc.name === name);
  },

  getPrimaryBlockchain() {
    return Object.values(this.blockchains).find(bc => bc.primary);
  }
};
