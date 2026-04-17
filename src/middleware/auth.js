const jwt = require("jsonwebtoken");
const db = require("../db/mysql");

const JWT_SECRET = "secretkey";

function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.cookies.adminToken; //allow both user and admin for user portal

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.query(
      "SELECT id FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length === 0) {
          res.clearCookie("token");
          res.clearCookie("adminToken");
          return res.status(401).json({ error: "User deleted. Logged out." });
        }

        req.user = decoded;
        next();
      },
    );
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = { authenticateToken };
