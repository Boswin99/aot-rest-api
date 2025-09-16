// routes/ipgRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment, validateSession, getGatewayConfig, healthCheck } = require('../controllers/ipg.controller');

// Middleware for request validation (optional)
const validatePaymentRequest = (req, res, next) => {
  const { currency, amount, orderRefId, description } = req.body;
  
  // Basic validation middleware
  if (!currency || !amount || !orderRefId || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: currency, amount, orderRefId, description',
      code: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

// Routes
router.post('/create-session', validatePaymentRequest, createPayment);
router.get('/validate-session/:sessionId', validateSession);
router.get('/config', getGatewayConfig);
router.get('/health', healthCheck);

module.exports = router;