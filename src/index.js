// Main application entry point
const app = require('./app');
const logger = require('./utils/logger');

logger.info('Clever Crypto Trading Platform - Initializing...');

if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;