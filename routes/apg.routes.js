// routes/apg.routes.js
const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/ipg.controller");

// POST /api/apg/create-payment
router.post("/create-payment", createPayment);

module.exports = router;
