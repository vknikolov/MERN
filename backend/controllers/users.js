const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// mongoose model
const User = require("../models/user");
// Helpers
const HttpError = require("../models/http-error");
const JWTToken = require("../util/jwt-token");

// Controller function to get all users
const getUsers = async (request, response, next) => {
  console.log("GET /users/ request received");
  let users;
  // Fetch users from the database
  try {
    users = await User.find({}, "-password"); // '-password' will exclude the password field
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  // Convert Mongoose documents to plain JS objects and remove the '_' from id field with getters
  const usersList = users.map((user) => user.toObject({ getters: true }));
  response.status(200).json({
    message: "GET /users/ endpoint reached",
    users: usersList,
  });
};

// Controller function for user signup
const signup = async (request, response, next) => {
  console.log("POST /users/signup request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Extract data from request
  const { name, email, password } = request.body;

  // Check if user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  // If user exists, return error
  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  // Hash the password before saving to database
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  // Check if image was uploaded
  if (!request.file) {
    return next(new HttpError("No image provided.", 422));
  }

  // Create new user
  const newUser = new User({
    name,
    email,
    image: request.file.path, // Image path from uploaded file
    password: hashedPassword, // Store hashed password
    places: [],
  });

  // Save new user to the database
  try {
    await newUser.save();
  } catch (error) {
    console.log("Error saving user:", error);
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  // Generate JWT token for the new user
  let token;
  try {
    token = JWTToken({ userId: newUser.id, email: newUser.email }); // Generate token
  } catch (error) {
    console.log("Error generating token:", error);
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  // Respond with success message
  response.status(201).json({
    message: "User signed up successfully!",
    userId: newUser.id,
    email: newUser.email,
    token: token,
  });
};

// Controller function for user login
const login = async (request, response, next) => {
  console.log("POST /users/login request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  // Extract data from request
  const { email, password } = request.body;

  let existingUser;
  // Find user by email
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }
  // Check if user exists and password matches
  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  // Compare provided password with stored hashed password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password); // true if matches
  } catch (error) {
    return next(
      new HttpError("Could not log you in, please check your credentials.", 500)
    );
  }

  // If password is invalid, return error
  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 403)
    );
  }

  // Generate JWT token for the logged-in user
  let token;
  try {
    token = JWTToken({ userId: existingUser.id, email: existingUser.email }); // Generate token
  } catch (error) {
    return next(
      new HttpError("Logging failed, please try again later.", 500)
    );
  }

  // Handle user login logic here
  response.status(200).json({
    message: "User logged in successfully!",
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

// Export controller functions
module.exports = {
  getUsers,
  signup,
  login,
};
