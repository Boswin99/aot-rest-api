// controllers/apgController.js
const axios = require("axios");
const logger = require("../utils/logger");

// ---- Static creds (put in env if you ever change your mind) ----
const CLIENT_ID = "5LA13XX3HV7BZOBBSC95VT7J";
const BEARER_TOKEN = "0587bc811254eb0551c39859eafc269754ae95051cd05b3991a5b80782bd6c73fd8e795a1e730d06fff8acb1a47e8e96732c89da0b9d5de101c1024fa84eaaef1d1f8586972b2df8cb57e2c1374e1ce0d5589c8ec0bbe57b9edab30db207d73e0fb8f4eb671c7416584bc67df766610f1cb774b8e2f7c693b746d3a44fed99e5";

function requireFields(body, fields) {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ""
  );
  if (missing.length) {
    const err = new Error(`Missing required field(s): ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
}

exports.createPayment = async (req, res) => {
  const { currency, amount, orderRefId, description } = req.body;
  const payload = { currency, amount, orderRefId, description };

  try {
    logger.info("Received create payment request", { payload });

    requireFields(payload, ["currency", "amount", "orderRefId", "description"]);

    const url =
      "https://mastercard-ipg-jr6b4avliq-uc.a.run.app/secure/v1/mpsg/create-session";

    logger.info("Calling Mastercard API", { url, orderRefId });

    const resp = await axios.post(url, payload, {
      headers: {
        ClientId: CLIENT_ID,
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    logger.info("Received response from Mastercard API", {
      status: resp.status,
      orderRefId,
    });

    if (resp.status >= 200 && resp.status < 300) {
      res.status(resp.status).json(resp.data);
    } else {
      logger.error("Mastercard API error", {
        status: resp.status,
        data: resp.data,
        orderRefId,
      });
      res.status(resp.status || 502).json({
        message: "APG create-session request failed",
        status: resp.status,
        data: resp.data,
      });
    }
  } catch (err) {
    logger.error("Internal server error", {
      message: err.message,
      stack: err.stack,
      orderRefId,
    });
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
};