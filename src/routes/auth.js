const express = require("express");
const router = express.Router();

const { signup, login, logout, me } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

module.exports = router;
