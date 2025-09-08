const express = require("express");
const { login, me, refreshToken } = require("../controllers/auth.controller");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { validate } = require("../middleware/validate");
const { loginSchema, refreshTokenSchema } = require("../validators/auth.validator");

const router = express.Router();

// Login (backend handles Firebase login)
router.post("/login", validate(loginSchema), login);

// Refresh token
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

// Protected route to get current user
router.get("/me", authenticateFirebaseToken, me);

module.exports = router;
