const JWT = require("jsonwebtoken");

// Function to create JWT token with given payload and expiration time
const JWTToken = (payload, expiresIn = "1h") => {
  return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

module.exports = JWTToken;
