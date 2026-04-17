const express = require("express");
const router = express.Router();

const db = require("../db/mysql");
const { authenticateAdmin } = require("../middleware/adminAuth");

// get users
router.get("/users", authenticateAdmin, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  db.query(
    "SELECT id, name, email, role FROM users WHERE role != 'admin'",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ users: results });
    },
  );
});

// get entries
router.get("/entries", authenticateAdmin, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const query = `
    	SELECT 
  	user_data.id,
  	user_data.content,
 	user_data.created_at,
  	users.name,
 	 users.email,
  	users.role
	FROM user_data
	JOIN users ON user_data.user_id = users.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ entries: results });
  });
});

// deletes user
router.delete("/user/:id", authenticateAdmin, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const userIdToDelete = req.params.id;

  if (parseInt(userIdToDelete) === req.user.id) {
    return res
      .status(403)
      .json({ error: "You cannot delete your own admin account." });
  }

  db.query(
    "SELECT role FROM users WHERE id = ?",
    [userIdToDelete],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      if (results[0].role === "admin") {
        return res
          .status(403)
          .json({ error: "Admin accounts cannot be deleted." });
      }

      db.query("DELETE FROM users WHERE id = ?", [userIdToDelete], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ message: "User deleted successfully." });
      });
    },
  );
});

// deletes entry
router.delete("/entry/:id", authenticateAdmin, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  db.query("DELETE FROM user_data WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Entry deleted" });
  });
});

module.exports = router;
