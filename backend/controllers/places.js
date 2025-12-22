const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
// Helpers
const HttpError = require("../models/http-error");
const getCordinatesForAddress = require("../util/location");

// Dummy data
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/da/At_New_York_City_2023_031_-_Empire_State_Building_seen_from_the_High_Line.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorId: "u1",
  },
  {
    id: "p2",
    title: "Statue of Liberty",
    description: "Famous colossal neoclassical sculpture on Liberty Island.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Statue_of_Liberty_Annular_Solar_Eclipse_%2851239095574%29.jpg",
    address: "Liberty Island, New York, NY 10004, United States",
    location: {
      lat: 40.6892494,
      lng: -74.0445004,
    },
    creatorId: "u2",
  },
  {
    id: "p3",
    title: "Central Park",
    description:
      "An urban park in New York City located between the Upper West and Upper East Sides of Manhattan.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Central_Park_New_York_City_New_York_23_crop.jpg",
    address: "New York, NY, United States",
    location: {
      lat: 40.785091,
      lng: -73.968285,
    },
    creatorId: "u1",
  },
];

// Controller functions for places
const getPlacesByUserId = (request, response, next) => {
  console.log("GET /places/user/ request received");
  const userID = request.params.userId;
  const places = DUMMY_PLACES.filter((p) => p.creatorId === userID);
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  response
    .status(200)
    .json({ message: "GET /places/user/ endpoint reached", places: places });
};

// Controller function to get place by ID
const getPlaceById = (request, response, next) => {
  console.log("GET /places/ request received");
  const placeID = request.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeID);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  response
    .status(200)
    .json({ message: "GET /places/ endpoint reached", place: place });
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

  const { title, description, address, creatorId } = request.body;
  let location;
  try {
    location = await getCordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location,
    address,
    creatorId,
  };

  DUMMY_PLACES.push(createdPlace);

  response
    .status(201)
    .json({ message: "POST /places/ endpoint reached", place: createdPlace });
};

// Controller function to update a place
const updatePlace = (request, response, next) => {
  console.log("PATCH /places/ request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = request.body;
  const placeID = request.params.placeId;
  // Find and update the place
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeID) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeID);
  updatedPlace.title = title;
  updatedPlace.description = description;
  // Save the updated place back to the dummy data
  DUMMY_PLACES[placeIndex] = updatedPlace;
  response
    .status(200)
    .json({ message: "PATCH /places/ endpoint reached", place: updatedPlace });
};

// Controller function to delete a place
const deletePlace = (request, response, next) => {
  console.log("DELETE /places/ request received");
  // Validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid place id provided.", 422));
  }

  const placeID = request.params.placeId;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeID);
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
