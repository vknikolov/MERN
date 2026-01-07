const { Router } = require("express");
const { check } = require("express-validator");
// Initialize Router
const router = Router();
// multer middleware for file upload
const fileUpload = require("../middleware/file-upload");
// Controllers
const { getUsers, signup, login } = require("../controllers/users");

// Order of routes matters! Place specific route should come before general route
// Get all users route
router.get("/", getUsers);

// User signup route
router.post(
  "/signup",
  fileUpload.single("image"), // Middleware to handle single file upload with field name "image"
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

// User login route
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  login
);

// Export the router
module.exports = router;
