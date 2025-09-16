// controllers/ipgController.js
const logger = require("../utils/logger");
const axios = require("axios"); 

class IPGController {
  constructor() {
    // Move sensitive data to environment variables
    this.bearerToken =
      process.env.IPG_BEARER_TOKEN ||
      "0587bc811254eb0551c39859eafc269754ae95051cd05b3991a5b80782bd6c73fd8e795a1e730d06fff8acb1a47e8e96732c89da0b9d5de101c1024fa84eaaef1d1f8586972b2df8cb57e2c1374e1ce0d5589c8ec0bbe57b9edab30db207d73e0fb8f4eb671c7416584bc67df766610f1cb774b8e2f7c693b746d3a44fed99e5";
    this.clientId = process.env.IPG_CLIENT_ID || "5LA13XX3HV7BZOBBSC95VT7J";
    this.ipgBaseUrl =
      process.env.IPG_BASE_URL ||
      "https://mastercard-ipg-jr6b4avliq-uc.a.run.app";
    this.gatewayUrl =
      process.env.GATEWAY_URL ||
      "https://seylan.gateway.mastercard.com/api/documentation/integrationGuidelines/hostedCheckout/implementingTheHostedPaymentPage.html?locale=en_US";
  }

  /**
   * Create payment session
   */
  createPayment = async (req, res) => {
    try {
      const { currency, amount, orderRefId, description } = req.body;

      // Validate required fields
      const requiredFields = [
        "currency",
        "amount",
        "orderRefId",
        "description",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          code: "VALIDATION_ERROR",
        });
      }

      // Validate bearer token
      if (!this.bearerToken) {
        logger.error("Bearer token not configured");
        return res.status(500).json({
          success: false,
          error: "Payment gateway not properly configured",
          code: "CONFIG_ERROR",
        });
      }

      // Validate amount is a positive number
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: "Amount must be a positive number",
          code: "INVALID_AMOUNT",
        });
      }

      // Prepare payload for IPG API
      const payload = {
        currency,
        amount: numericAmount,
        orderRefId,
        description,
      };

      logger.info(`Creating payment session for order: ${orderRefId}`, {
        currency,
        amount: numericAmount,
        orderRefId,
      });

      // Make request to IPG API
      const response = await axios.post(
        `${this.ipgBaseUrl}/secure/v1/mpgs/create-session`,
        payload,
        {
          headers: {
            ClientId: this.clientId,
            Authorization: `Bearer ${this.bearerToken}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // Extract session ID from response
      let sessionId = null;
      if (response.data && response.data.data && response.data.data.sessionId) {
        sessionId = response.data.data.sessionId;
      } else if (response.data && response.data.sessionId) {
        sessionId = response.data.sessionId;
      }

      if (!sessionId) {
        logger.error("Session ID not found in API response", {
          responseData: response.data,
          orderRefId,
        });
        return res.status(500).json({
          success: false,
          error: "Invalid response from payment gateway",
          code: "INVALID_RESPONSE",
        });
      }

      logger.info(`Payment session created successfully`, {
        sessionId,
        orderRefId,
      });

      // Return success response
      return res.status(200).json({
        success: true,
        sessionId,
        data: response.data.data || response.data,
        gatewayUrl: this.gatewayUrl,
      });
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // API responded with error status
        logger.error(`IPG API error: ${error.response.status}`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          orderRefId: req.body.orderRefId,
        });

        return res
          .status(error.response.status === 401 ? 500 : error.response.status)
          .json({
            success: false,
            error:
              error.response.data?.message ||
              `Payment gateway error: ${error.response.statusText}`,
            code: error.response.status === 401 ? "AUTH_ERROR" : "API_ERROR",
            details: error.response.data,
          });
      } else if (error.request) {
        // Request was made but no response received
        logger.error("No response from IPG API", {
          error: error.message,
          orderRefId: req.body.orderRefId,
        });

        return res.status(503).json({
          success: false,
          error: "Payment gateway is currently unavailable",
          code: "GATEWAY_UNAVAILABLE",
        });
      } else {
        // Something else happened
        logger.error("Unexpected error in createPayment", {
          error: error.message,
          stack: error.stack,
          orderRefId: req.body.orderRefId,
        });

        return res.status(500).json({
          success: false,
          error: "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        });
      }
    }
  };

  /**
   * Validate payment session
   */
  validateSession = async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: "Session ID is required",
          code: "VALIDATION_ERROR",
        });
      }

      // Here you can add logic to validate session with IPG
      // This is just a basic validation
      return res.status(200).json({
        success: true,
        sessionId,
        gatewayUrl: this.gatewayUrl,
        checkoutScriptUrl: `${this.gatewayUrl}/static/checkout/checkout.min.js`,
      });
    } catch (error) {
      logger.error("Error validating session", {
        error: error.message,
        sessionId: req.params.sessionId,
      });

      return res.status(500).json({
        success: false,
        error: "Failed to validate session",
        code: "VALIDATION_FAILED",
      });
    }
  };

  /**
   * Get gateway configuration for frontend
   */
  getGatewayConfig = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        config: {
          gatewayUrl: this.gatewayUrl,
          checkoutScriptUrl: `${this.gatewayUrl}/static/checkout/checkout.min.js`,
          clientId: this.clientId, // Safe to expose client ID
        },
      });
    } catch (error) {
      logger.error("Error getting gateway config", {
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        error: "Failed to get gateway configuration",
        code: "CONFIG_ERROR",
      });
    }
  };

  /**
   * Health check for payment gateway
   */
  healthCheck = async (req, res) => {
    try {
      const isConfigured = !!(
        this.bearerToken &&
        this.clientId &&
        this.ipgBaseUrl
      );

      return res.status(200).json({
        success: true,
        status: isConfigured ? "healthy" : "misconfigured",
        timestamp: new Date().toISOString(),
        config: {
          hasToken: !!this.bearerToken,
          hasClientId: !!this.clientId,
          baseUrl: this.ipgBaseUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Health check failed",
        code: "HEALTH_CHECK_FAILED",
      });
    }
  };
}

// Create controller instance
const ipgController = new IPGController();

module.exports = {
  createPayment: ipgController.createPayment,
  validateSession: ipgController.validateSession,
  getGatewayConfig: ipgController.getGatewayConfig,
  healthCheck: ipgController.healthCheck,
};
