const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
// Routes
const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
//Helpers
const HttpError = require("./models/http-error");

// Initialize Express app
const app = express();
const PORT = 8080;
// Middleware
app.use(bodyParser.json());

// Serve static files from the "uploads/images" directory
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// CORS headers middleware to allow cross-origin requests
app.use((request, response, next) => {
  // Allow access from any origin
  response.setHeader("Access-Control-Allow-Origin", "*");

  // Allow specific headers in requests
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Allow specific HTTP methods in requests
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE"
  );
  // Proceed to the next middleware or route handler
  next();
});

// Use Routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Handle unsupported routes
app.use((request, response, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// ERROR handling middleware
app.use((error, request, response, next) => {
  // Delete uploaded file if there was an error during request processing
  if (request.file) {
    // If there was an uploaded file, delete it
    fs.unlink(request.file.path, (error) => {
      console.error(error);
    });
  }
  if (response.headerSent) {
    return next(error);
  }
  response
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

// Start the server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@shop.p0nd9dc.mongodb.net/${process.env.DB_NAME}?appName=${process.env.DB_APP_NAME}`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
