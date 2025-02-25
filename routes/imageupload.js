const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // Save files to 'uploads' folder
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


// Upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Image Upload Route
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "Image uploaded successfully",
    file: req.file.filename,
    filePath: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
