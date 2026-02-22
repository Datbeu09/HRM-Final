require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

// ===== CORS CONFIG (FIX PATCH + OPTIONS) =====
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Cho phép preflight request (rất quan trọng với PATCH)
app.options("*", cors());

// ===== IMPORT MIDDLEWARE =====
const requireAuth = require("./middleware/requireAuth");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// ===== ROUTES =====
app.use("/api", require("./routes"));

// Ví dụ protected route
app.use("/api/protected-route", requireAuth, (req, res) => {
  res.json({
    success: true,
    message: "You have access to this protected route!",
  });
});

// ===== ERROR HANDLING =====
app.use(notFound);
app.use(errorHandler);

module.exports = app;