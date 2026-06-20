// API Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const tradeController = require('../controllers/tradeController');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Auth routes
router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/register', authController.register.bind(authController));
router.post('/auth/logout', authController.logout.bind(authController));

// Trade routes
router.post('/trades/execute', tradeController.executeTrade.bind(tradeController));
router.get('/trades/history', tradeController.getTradeHistory.bind(tradeController));
router.delete('/trades/:id', tradeController.cancelTrade.bind(tradeController));

module.exports = router;