// Configuration management
module.exports = {
  app: {
    name: 'Clever Crypto',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'crypto_trading',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  api: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.API_URL || 'http://localhost:3000'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiry: process.env.JWT_EXPIRY || '7d'
  }
};