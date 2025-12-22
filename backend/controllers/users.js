const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
// Helpers
const HttpError = require("../models/http-error");

// Dummy data
const DUMMY_USERS = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password456",
  },
];

// Controller function to get all users
const getUsers = (request, response, next) => {
  console.log("GET /users/ request received");
  response
    .status(200)
    .json({ message: "GET /users/ endpoint reached", users: DUMMY_USERS });
};

// Controller function for user signup
const signup = (request, response, next) => {
  console.log("POST /users/signup request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = request.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("User exists already, please login instead.", 422);
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(newUser);
  // Handle user signup logic here
  response
    .status(201)
    .json({ message: "User signed up successfully!", user: newUser });
};

// Controller function for user login
const login = (request, response, next) => {
  console.log("POST /users/login request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = request.body;
  // Find user by email
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // Validate password
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Invalid credentials, could not log you in.", 401);
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
