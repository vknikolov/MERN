const express = require("express");
const bodyParser = require("body-parser");

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
  if (response.headerSent) {
    return next(error);
  }
  response
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
