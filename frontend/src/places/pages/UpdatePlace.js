import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
//Components
import Input from "../../shared/components/form-elements/input/Input";
import Button from "../../shared/components/form-elements/button/Button";
import Card from "../../shared/components/ui-elements/card/Card.js";
import ErrorModal from "../../shared/components/ui-elements/error-modal/ErrorModal.js";
import LoadingSpinner from "../../shared/components/ui-elements/spinner/LoadingSpinner.js";
// Hooks
import { useFormReducer } from "../../helpers/custom-hooks/useFormReducer.js";
import { useHttpClient } from "../../helpers/custom-hooks/http.js";
// Context
import { AuthenticationContext } from "../../shared/context/authentication-context.js";
//Validators
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../helpers/utils/validators";
// CSS
import "./styles/PlaceForm.css";

const UpdatePlace = () => {
  // Access authentication context to get User ID
  const authenticationContext = useContext(AuthenticationContext);
  
  // useHttpClient for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // State to hold loaded place
  const [loadedPlace, setLoadedPlace] = useState();

  // Get placeId from URL parameters
  const { placeId } = useParams();

  // History for navigation
  const history = useHistory();

  // useFormReducer for managing form state
  const [formState, inputHandler, setFormData] = useFormReducer(
    // Initial inputs state
    {
      title: { value: "", isValid: false }, // Title input
      description: { value: "", isValid: false }, // Description input
    },
    false // Form is invalid initially
  );

  useEffect(() => {
    // Fetch place details to pre-fill the form
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:8080/api/places/${placeId}`
        );
        setLoadedPlace(data.place);
        // Pre-fill the form with fetched data
        setFormData(
          {
            title: { value: data.place.title, isValid: true },
            description: { value: data.place.description, isValid: true },
          },
          true
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  // Form submission handler
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8080/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      // Navigate back to user's places after successful update
      history.push(`/${authenticationContext.userID}/places`);
    } catch (error) {
      console.error(error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  // If no place found, display message
  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form " onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            onChange={() => {}}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            onChange={() => {}}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
