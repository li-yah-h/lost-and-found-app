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
// Access via: http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static(uploadsDir));

/* ── Database connection ── */
console.log("🔗 Connecting to MongoDB...", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);           // Exit if DB is unavailable
  });

/* ── Routes ── */
app.use("/api/items", require("./routes/itemRoutes"));

/* ── Health check ── */
app.get("/", (req, res) => res.json({ status: "MEC Lost & Found API is running 🚀" }));

/* ── Global error handler (must be last) ── */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

/* ── Start server ── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
