const multer = require("multer");
const uuid = require("uuid").v4;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// Configure multer for file uploads
const fileUpload = multer({
  // File size limit
  limits: { fileSize: 500000 }, // Limit file size to 500KB
  // Storage configuration
  storage: multer.diskStorage({
    // Store files on disk
    destination: (req, file, cb) => {
      cb(null, "uploads/images"); // Specify the destination directory
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // Get file extension
      cb(null, uuid() + "-" + ext); // Generate unique filename
    },
  }),
  // File filter to accept only specific file types
  fileFilter: (req, file, cb) => {
    // Check if file type is valid
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    // Create error for invalid type
    let error = isValid ? null : new Error("Invalid mime type!");
    // Call the callback with error and validity
    cb(error, isValid);
  },
});

module.exports = fileUpload;
