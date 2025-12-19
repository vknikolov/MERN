import React, { use } from "react";
import { useParams } from "react-router-dom";
//Components
import Input from "../../shared/components/form-elements/input/Input";
import Button from "../../shared/components/form-elements/button/Button";
// Hooks
import { useFormReducer } from "../../helpers/custom-hooks/useFormReducer.js";
//Validators
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../helpers/utils/validators";
// CSS
import "./styles/PlaceForm.css";

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

const UpdatePlace = () => {
  // Get placeId from URL parameters
  const { placeId } = useParams();
  // Find the place to be updated
  const identifiedPlace = PLACES.find((p) => p.id === placeId);

  const [formState, inputHandler] = useFormReducer(
    // Initial inputs state
    {
      title: { value: identifiedPlace.title, isValid: true },
      description: { value: identifiedPlace.description, isValid: true },
    },
    true // Form is valid initially
  );

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // Handle form submission
  };

  // If no place found, display message
  if (!identifiedPlace) {
    return <h2>Could not find place!</h2>;
  }

  return (
    <form className="place-form " onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
        onChange={() => {}}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
        onChange={() => {}}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
