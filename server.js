const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

// Routes
const authRoutes = require("./src/routes/auth");
app.use("/api", authRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());
