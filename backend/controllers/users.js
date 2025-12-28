const { validationResult } = require("express-validator");
// mongoose model
const User = require("../models/user");
// Helpers
const HttpError = require("../models/http-error");

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
  const { name, email, password } = request.body;
  let existingUser;
  // Check if user already exists
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
  // Check if user already exists
  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }
  // Create new user
  const newUser = new User({
    name,
    email,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    password, // todo : Hash password
    places: [],
  });
  // Save new user to the database
  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
  // Respond with success message
  response.status(201).json({
    message: "User signed up successfully!",
    user: newUser.toObject({ getters: true }), // Convert Mongoose document to plain JS object and getters remove the _id field
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
  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  // Handle user login logic here
  response.status(200).json({ message: "User logged in successfully!" });
};

// Export controller functions
module.exports = {
  getUsers,
  signup,
  login,
};
