import React, { useState, useContext } from "react";
//Components
import Card from "../../shared/components/ui-elements/card/Card";
import Button from "../../shared/components/form-elements/button/Button";
import Input from "../../shared/components/form-elements/input/Input";
import ErrorModal from "../../shared/components/ui-elements/error-modal/ErrorModal";
import LoadingSpinner from "../../shared/components/ui-elements/spinner/LoadingSpinner";
import ImageUpload from "../../shared/components/form-elements/image-upload/ImageUpload.js";
// Context
import { AuthenticationContext } from "../../shared/context/authentication-context.js";
// Validators
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../helpers/utils/validators";
// Hooks
import { useFormReducer } from "../../helpers/custom-hooks/useFormReducer.js";
import { useHttpClient } from "../../helpers/custom-hooks/http.js";
// CSS
import "./styles/Authentication.css";

const Authentication = () => {
  const { login } = useContext(AuthenticationContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  // useFormReducer for managing form state
  const [formState, inputHandler, setFormData] = useFormReducer(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  // useHttpClient for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Form submission handler
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    const urlMode = isLoginMode ? "login" : "signup";
    const JSONData = isLoginMode
      ? JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        })
      : null; // Body is not used for signup as we use FormData
    const headersMode = isLoginMode
      ? { "Content-Type": "application/json" }
      : {};

    try {
      // Create form data for signup with image
      const formData = new FormData();
      if (!isLoginMode) {
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
      }

      // Send HTTP request to backend
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${urlMode}`,
        "POST",
        isLoginMode ? JSONData : formData,
        headersMode
      );

      // Log the user in upon successful authentication
      login(data.userId, data.token); // userId and token from response
    } catch (error) {
      // Error is handled in useHttpClient
      console.error(error);
    }
  };

  // Switch mode handler (login/signup)
  const switchModeHandler = () => {
    console.log("Switching mode");
    if (!isLoginMode) {
      // Switching to LOGIN MODE, remove name input from form data
      setFormData(
        // Remove name input
        {
          ...formState.inputs, // Keep existing inputs
          name: undefined, // Remove name input
          image: undefined, // Remove image input
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid // Update form validity
      );
    } else {
      // Switching to SIGNUP MODE, add name input to form data
      setFormData(
        // Add name input with initial values
        {
          ...formState.inputs, // Keep existing inputs
          name: { value: "", isValid: false }, // Add name input
          image: { value: null, isValid: false }, // Add image input
        },
        false // Form is invalid initially
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="authentication__header">
          <h2>Login required</h2>
        </div>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name."
              onInput={inputHandler}
              initialValue={
                formState.inputs.name ? formState.inputs.name.value : ""
              }
              initialValid={
                formState.inputs.name ? formState.inputs.name.isValid : false
              }
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
            initialValue={formState.inputs.email.value}
            initialValid={formState.inputs.email.isValid}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
            initialValue={formState.inputs.password.value}
            initialValid={formState.inputs.password.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Authentication;
