const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },   // renamed from 'desc'
  category:    { type: String, enum: ["Electronics", "ID Cards", "Books", "Others"], default: "Others" },
  status:      { type: String, enum: ["Lost", "Found", "Resolved"], default: "Lost" },
  image:       { type: String, default: null },     // filename or null if no image
  contact:     { type: String, required: true },
  date:        { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", itemSchema);
