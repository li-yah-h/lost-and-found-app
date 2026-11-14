const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");
require("dotenv").config();

const app = express();

/* ── Ensure uploads folder exists ── */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* ── Middleware ── */
app.use(cors({
  origin: "*",              // In production, replace * with your frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Serve uploaded images as static files ── */
app.use("/uploads", express.static(uploadsDir));

/* ── Database connection ── */
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lostfound";
let dbConnected = false;

console.log("🔗 Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    dbConnected = true;
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't exit — let the health-check report the failure
  });

/* ── API Routes ── */
app.use("/api/items", require("./routes/itemRoutes"));

/* ── Health check ── */
app.get("/api/health", (_req, res) => {
  res.json({
    status: dbConnected ? "ok" : "error",
    db: dbConnected ? "connected" : "disconnected",
    uptime: process.uptime()
  });
});

/* ── Serve frontend static files (for single-server deployment) ── */
const frontendDir = path.join(__dirname, "..", "frontend", "src");
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
  // Catch-all: serve index.html for any non-API route (SPA fallback)
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
  });
}

/* ── Global error handler (must be last) ── */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

/* ── Start server ── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
