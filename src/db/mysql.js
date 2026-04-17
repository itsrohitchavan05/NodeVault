/*const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "auth_app",
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;*/

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) {
    console.error("DB Error:", err);
  } else {
    console.log("DB Connected");
  }
});

module.exports = db;
