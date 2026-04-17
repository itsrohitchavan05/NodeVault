const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  }),
);
app.use(express.json());

app.use(express.static("public"));

// Routes
const authRoutes = require("./src/routes/auth");
const dataRoutes = require("./src/routes/data");
const adminRoutes = require("./src/routes/admin");
app.use("/api", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/admin", adminRoutes);

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
