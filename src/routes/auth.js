const express = require("express");
const router = express.Router();

const { signup, login, logout, me } = require("../controllers/authController");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
//router.get("/me", me);
router.get("/me", (req, res) => {
  res.json({
    user: {
      name: "Rohit",
      email: "demo@gmail.com"
    }
  });
});

module.exports = router;
