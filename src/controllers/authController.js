const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const db = require("../db/mysql");

const JWT_SECRET = "secretkey";

async function signup(req, res) {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";

    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Signup DB error:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            error: "Email already registered",
          });
        }

        return res.status(500).json({
          error: "Server error during signup",
        });
      }

      const userId = result.insertId;

      const token = jwt.sign(
        { id: userId, name, email, role: "user" },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      return res.status(201).json({
        message: "Account created successfully",
        user: { id: userId, name, email, role: "user" },
      });
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed" });
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

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      if (user.role === "admin") {
        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: true,
          //secure: false,
          sameSite: "None",
          //sameSite: "lax",
        });
      } else {
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          //secure: false,
          sameSite: "None",
          //sameSite: "lax",
        });
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during login." });
  }
}

function logout(req, res) {
  res.clearCookie("token");
  res.clearCookie("adminToken");

  return res.json({ message: "Logged out successfully" });
}

function me(req, res) {
  const token = req.cookies.token || req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ user: decoded });
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = { signup, login, logout, me };
