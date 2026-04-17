const db = require("../db/mysql");

// Get all entries
exports.getAllData = (req, res) => {
  const query =
    "SELECT * FROM user_data WHERE user_id = ? ORDER BY created_at DESC";

  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ data: results });
  });
};

// Create new entry
exports.createData = (req, res) => {
  const { content } = req.body;

  const query = "INSERT INTO user_data (user_id, content) VALUES (?, ?)";

  db.query(query, [req.user.id, content], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      message: "Entry created",
      data: {
        id: result.insertId,
        content,
        created_at: new Date(),
      },
    });
  });
};

// Delete entry
exports.deleteData = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM user_data WHERE id = ? AND user_id = ?";

  db.query(query, [id, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Entry deleted" });
  });
};
