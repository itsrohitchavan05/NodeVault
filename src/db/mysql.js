const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "rohit",
  password: "1234",
  database: "auth_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
