import { useContext } from "react";
import { useHistory } from "react-router-dom";
// Components
import Input from "../../shared/components/form-elements/input/Input.js";
import Button from "../../shared/components/form-elements/button/Button.js";
import ErrorModal from "../../shared/components/ui-elements/error-modal/ErrorModal.js";
import LoadingSpinner from "../../shared/components/ui-elements/spinner/LoadingSpinner.js";
// Hooks
import { useFormReducer } from "../../helpers/custom-hooks/useFormReducer.js";
import { useHttpClient } from "../../helpers/custom-hooks/http.js";
// Validators
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../helpers/utils/validators.js";
// Context
import { AuthenticationContext } from "../../shared/context/authentication-context.js";
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
  // Get userID from AuthenticationContext
  const { userID } = useContext(AuthenticationContext);

  // useHttpClient for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // useFormReducer for managing form state
  const [formState, inputHandler] = useFormReducer(
    initialFormState.inputs, // Initial inputs state
    initialFormState.isValid // Form is invalid initially
  );
  // useHistory for navigation
  const history = useHistory();

  // Form submission handler
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        "http://localhost:8080/api/places",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: userID,
        }),
        { "Content-Type": "application/json" }
      );

      // Redirect to homepage after successful place creation
      history.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
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
    </>
  );
};

export default NewPlace;
