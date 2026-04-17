const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mysql = require('../db/mysql');
const { JWT_SECRET } = require('../middleware/auth');

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const checkQuery = "SELECT id FROM users WHERE email = ?";

    mysql.query(checkQuery, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(409).json({ error: "Email already registered." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert user
      const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      mysql.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const token = jwt.sign(
          { id: result.insertId, name, email },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
        });

        return res.status(201).json({
          message: "Account created successfully",
          user: { id: result.insertId, name, email },
        });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during signup." });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ?";

    mysql.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });

      return res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during login." });
  }
}

function logout(req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully.' });
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { signup, login, logout, me };
