// server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables FIRST
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/maintenance", require("./routes/maintenanceRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Server Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});