const { Router } = require("express");
const { check } = require("express-validator"); // For input validation
// multer middleware for file upload
const fileUpload = require("../middleware/file-upload");
// Controllers
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places");

// Initialize Router
const router = Router();

// Order of routes matters! Place specific route should come before general route
// User specific route
router.get("/user/:userId", getPlacesByUserId);

// Place specific route
router.get("/:placeId", getPlaceById);

// Create new place route
router.post(
  "/",
  fileUpload.single("image"), // Middleware to handle single file upload with field name "image"
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

// Update place route
router.patch(
  "/:placeId",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  updatePlace
);

// Delete place route
router.delete("/:placeId", [check("placeId").not().isEmpty()], deletePlace);

// Export the router
module.exports = router;
