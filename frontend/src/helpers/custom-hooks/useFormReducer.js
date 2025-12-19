import { useCallback, useReducer } from "react";

// Reducer function to manage form state based on input changes
const formReducer = (state, action) => {
  // Handle different action types
  switch (action.type) {
    // When an input changes
    case "INPUT_CHANGE":
      // Check overall form validity
      let formIsValid = true;
      // Iterate through all inputs to determine form validity
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) continue; // Skip if property is undefined for login/signup mode switch
        if (inputId === action.id) {
          // If this is the input being updated
          formIsValid = formIsValid && action.isValid; // Use the updated validity
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid; // Use existing validity
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs, // Keep other inputs unchanged
          [action.id]: { value: action.value, isValid: action.isValid }, // Update the specific input
        },
        isValid: formIsValid,
      };
    // When setting form data programmatically
    case "SET_DATA":
      return {
        inputs: action.inputs, // Set new inputs
        isValid: action.formIsValid, // Set new overall form validity
      };
    default:
      return state;
  }
};
// Custom hook to manage form state using the reducer
export const useFormReducer = (initialInputs, initialFormValidity) => {
  // Initialize useReducer with the formReducer and initial state
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs, // Initial input states
    isValid: initialFormValidity, // Initial overall form validity
  });
  // Handler to be called when an input changes
  const inputHandler = useCallback((id, value, isValid) => {
    // Dispatch an action to update the form state
    dispatch({ type: "INPUT_CHANGE", id: id, value: value, isValid: isValid });
  }, []);
  // Function to set form data programmatically
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);
  // Return the current form state and the input handler
  return [formState, inputHandler, setFormData];
};
