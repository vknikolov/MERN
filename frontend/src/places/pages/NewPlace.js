import React from "react";
// Components
import Input from "../../shared/components/form-elements/input/Input.js";
import Button from "../../shared/components/form-elements/button/Button.js";
// Hooks
import { useFormReducer } from "../../helpers/custom-hooks/useFormReducer.js";
// Validators
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../helpers/utils/validators.js";
// CSS
import "./styles/PlaceForm.css";

// Initial form state
const initialFormState = {
  inputs: {
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
  },
  isValid: false,
};

const NewPlace = () => {
  const [formState, inputHandler] = useFormReducer(
    initialFormState.inputs, // Initial inputs state
    initialFormState.isValid // Form is invalid initially
  );

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // Handle form submission
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        type="text"
        placeholder="Title"
        id="title"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        type="textarea"
        placeholder="Description"
        id="description"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />

      <Input
        type="input"
        placeholder="Address"
        id="address"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />

      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
