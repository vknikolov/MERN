import React, { useState, useContext } from "react";
//Components
import Card from "../../shared/components/ui-elements/card/Card";
import Button from "../../shared/components/form-elements/button/Button";
import Input from "../../shared/components/form-elements/input/Input";
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
// CSS
import "./styles/Authentication.css";

const Authentication = () => {
  const { isLoggedIn, login, logout } = useContext(AuthenticationContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  // useFormReducer for managing form state
  const [formState, inputHandler, setFormData] = useFormReducer(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );
  // Form submission handler
  const authSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    login()
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
        },
        false // Form is invalid initially
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  return (
    <Card className="authentication">
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
  );
};

export default Authentication;
