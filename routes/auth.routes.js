const express = require("express");
const { login, me } = require("../controllers/auth.controller");
const { authenticateFirebaseToken } = require("../middleware/authenticateFirebaseToken");
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../validators/auth.validator");

const router = express.Router();

// Login (backend handles Firebase login)
router.post("/login", validate(loginSchema), login);

// Protected route to get current user
router.get("/me", authenticateFirebaseToken, me);

module.exports = router;
