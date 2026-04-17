const jwt = require("jsonwebtoken");

const JWT_SECRET = "secretkey";

function authenticateAdmin(req, res, next) {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ error: "Admin not logged in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Not admin" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid admin token" });
  }
}

module.exports = { authenticateAdmin };
