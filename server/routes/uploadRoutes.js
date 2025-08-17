// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();

const upload = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');
const Image = require('../models/image');

// serve static local files
router.use('/uploads', express.static('public/uploads'));

// upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = req.file.path;

    const cloudinaryResponse = await cloudinary.uploader.upload(file, {
      folder: "Images-Upload-Test"
    });

    const newImage = await Image.create({
      title: cloudinaryResponse.original_filename,
      url: cloudinaryResponse.secure_url
    });

    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      filePath: `/uploads/${req.file.filename}`, 
      url: cloudinaryResponse.secure_url
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
