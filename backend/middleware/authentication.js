const JWT = require("jsonwebtoken");
const HttpError = require("../models/http-error");

// Middleware for authenticating JWT tokens in incoming requests
module.exports = (request, response, next) => {
  // Allow OPTIONS requests to pass through without authentication
  if (request.method === "OPTIONS") {
    return next();
  }

  // Extract token from Authorization header
  let token;
  try {
    token = request.headers.authorization.split(" ")[1]; // Expected format: "Bearer TOKEN"
    // If no token is found, return an error
    if (!token) {
      throw new Error("Authentication failed!");
    }
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }

  // Verify the token
  let decodedToken;
  try {
    decodedToken = JWT.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new HttpError("Authentication failed!", 401));
  }

  // If token is invalid, return an error
  if (!decodedToken) {
    return next(new HttpError("Authentication failed!", 403));
  }

  // Attach user data to the request object for further use
  request.userData = { userId: decodedToken.userId, email: decodedToken.email };
  next();
};
