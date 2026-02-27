const express = require("express");
const router  = express.Router();
const Item    = require("../models/Item");
const multer  = require("multer");
const path    = require("path");

/* ── Multer storage config ── */
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    // Sanitize original filename and prefix with timestamp
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safe);
  }
});

// Only allow image file types
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

/* ────────────────────────────────────────
   POST /api/items  — Create a new item
   ──────────────────────────────────────── */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, status, contact } = req.body;

    // Basic validation
    if (!title || !description || !contact) {
      return res.status(400).json({ error: "title, description, and contact are required." });
    }

    const item = new Item({
      title,
      description,
      category,
      status,
      contact,
      image: req.file ? req.file.filename : null   // null when no image uploaded
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────
   GET /api/items  — Fetch all items (newest first)
   Optional query params:
     ?status=Lost|Found|Resolved
     ?category=Electronics|ID Cards|Books|Others
   ──────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const items = await Item.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────
   GET /api/items/:id  — Fetch single item
   ──────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────
   PATCH /api/items/:id  — Update item status
   Body: { status: "Resolved" }
   ──────────────────────────────────────── */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Lost", "Found", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "status must be Lost, Found, or Resolved." });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }          // return the updated document
    );

    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────────────
   DELETE /api/items/:id  — Remove an item
   ──────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json({ message: "Item deleted.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
