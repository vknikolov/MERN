import React from "react";
import { useParams } from "react-router-dom";
// Components
import PlaceList from "../components/place-list/PlaceList";

const PLACES = [
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
];

const UserPlaces = () => {
  const { userId } = useParams();
  const filteredPlacesByUser = PLACES.filter(
    (place) => place.creatorId === userId
  );
  return <PlaceList items={filteredPlacesByUser} />;
};

export default UserPlaces;
