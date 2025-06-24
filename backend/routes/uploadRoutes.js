const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { protect } = require("../middleware/authMiddleware");

require("dotenv").config();

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route POST /api/upload
// @desc Upload image to Cloudinary
// @access Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    console.log("Upload route hit by user:", req.user?.name);
    console.log("File received:", req.file ? "Yes" : "No");
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        // Use streamifier to convert buffer to a stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Await the upload result
    console.log("Starting Cloudinary upload...");
    const result = await streamUpload(req.file.buffer);
    console.log("Upload successful, URL:", result.secure_url);

    // Respond with the uploaded image URL
    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
