const fs = require("fs");
const path = require("path");
// External modules
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
// Helpers
const HttpError = require("../models/http-error");
const getCordinatesForAddress = require("../util/location");

// mongoose model
const Place = require("../models/place");
const User = require("../models/user");

// Controller functions for places
const getPlacesByUserId = async (request, response, next) => {
  console.log("GET /places/user/ request received");
  const userID = request.params.userId;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userID).populate("places"); // populate to get full place data
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find places.", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  // Convert Mongoose documents to plain JS objects
  const placesList = userWithPlaces.places.map((place) =>
    place.toObject({ getters: true })
  );

  response.status(200).json({
    message: "GET /places/user/ endpoint reached",
    places: placesList,
  });
};

// Controller function to get place by ID
const getPlaceById = async (request, response, next) => {
  console.log("GET /places/ request received");
  const placeID = request.params.placeId;
  let place;
  try {
    place = await Place.findById(placeID);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not find a place.", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  response.status(200).json({
    message: "GET /places/ endpoint reached",
    place: place.toObject({ getters: true }), // Convert Mongoose document to plain JS object
  });
};

// Controller function to create a new place
const createPlace = async (request, response, next) => {
  console.log("POST /places/ request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = request.body;
  let location;
  try {
    location = await getCordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image: request.file.path, // Image path from uploaded file
    address,
    location,
    creator: request.userData.userId, // Creator userID from authentication middleware
  });

  let user;
  // Verify that the creator user exists
  try {
    user = await User.findById(request.userData.userId); // userID from authentication middleware
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  // If user does not exist, return error
  if (!user) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  // Save the new place to the database
  try {
    // Use a session and transaction to ensure both place creation and user update succeed
    const session = await mongoose.startSession();
    session.startTransaction();
    // Save the new place
    await createdPlace.save({ session: session });
    user.places.push(createdPlace); // Add place to user's places array
    // Save the updated user
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  // Respond with success message
  response
    .status(201)
    .json({ message: "POST /places/ endpoint reached", place: createdPlace });
};

// Controller function to update a place
const updatePlace = async (request, response, next) => {
  console.log("PATCH /places/ request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // Extract data from request
  const { title, description } = request.body;

  // Find place by ID
  const placeID = request.params.placeId;

  let place;
  // Fetch place from database
  try {
    place = await Place.findById(placeID);
  } catch (error) {
    return next(
      new HttpError("Could not update place, please try again.", 500)
    );
  }

  // Check if the authenticated user is the creator of the place
  if (place.creator.toString() !== request.userData.userId.toString()) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  // Update place details after fetching
  place.title = title;
  place.description = description;

  // Save updated place to database
  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Could not update place, please try again.", 500)
    );
  }

  // Convert Mongoose document to plain JS object
  const updatedPlace = place.toObject({ getters: true });
  response
    .status(200)
    .json({ message: "PATCH /places/ endpoint reached", place: updatedPlace });
};

// Controller function to delete a place
const deletePlace = async (request, response, next) => {
  console.log("DELETE /places/ request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid place id provided.", 422));
  }
  // Find place by ID
  const placeID = request.params.placeId;
  let place;
  // Fetch place from database
  try {
    place = await Place.findById(placeID).populate("creator"); // populate to get full user data of creator
  } catch (error) {
    return next(new HttpError("Could not find place, please try again.", 500));
  }
  // Check if place exists
  if (!place) {
    return next(new HttpError("Could not find place for this id.", 404));
  }

  // Check if the authenticated user is the creator of the place
  if (place.creator.id.toString() !== request.userData.userId.toString()) {
    return next(
      new HttpError("You are not allowed to delete this place.", 401)
    );
  }

  // Store image path to delete the file later
  const imagePath = place.image;

  // Delete place from database
  try {
    // Use a session and transaction to ensure both place deletion and user update succeed
    const session = await mongoose.startSession(); // Start a mongoose session for transaction
    session.startTransaction(); // Start the transaction
    await place.deleteOne({ session: session }); // .remove() is deprecated, using deleteOne() instead
    place.creator.places.pull(place); // Remove place from user's places array
    await place.creator.save({ session: session });
    await session.commitTransaction(); // Commit the transaction
  } catch (error) {
    return next(
      new HttpError("Could not delete place, please try again.", 500)
    );
  }

  // Delete the image file associated with the place
  fs.unlink(imagePath, (error) => {
    if (error) {
      console.error("Failed to delete image file:", error);
    }
  });

  // Respond with success message
  response.status(200).json({ message: "DELETE /places/ endpoint reached" });
};

// Export controller functions
module.exports = {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
