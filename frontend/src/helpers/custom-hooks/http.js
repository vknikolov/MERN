import { useState, useCallback, useRef, useEffect } from "react";

// Custom hook for HTTP requests
export const useHttpClient = () => {
  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // To keep track of active HTTP requests for cleanup
  const activeHttpRequests = useRef([]);

  // Function to send HTTP requests with useCallback to prevent unnecessary re-creations
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      // Create an AbortController for this request
      const abortController = new AbortController();
      // Add the controller to the active requests array
      activeHttpRequests.current.push(abortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortController.signal,
        });

        // Parse the JSON response
        const data = await response.json();

        // Remove the controller from the active requests array
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== abortController
        );

        // Handle non-OK responses
        if (!response.ok) {
          throw new Error(data.message);
        }
   
        setIsLoading(false);
        // Return the parsed data
        return data;
      } catch (error) {
        setIsLoading(false);
        // Handle errors
        setError(error.message || "Something went wrong, please try again.");
        throw error;
      }
    },
    [] // No dependencies
  );

  // Function to clear the error state
  const clearError = () => {
    setError(null);
  };

  // Cleanup effect to abort any active requests when the component using this hook unmounts
  useEffect(() => {
    // Copy the ref value to a variable to avoid stale ref issues
    const activeRequests = activeHttpRequests.current;
    // Cleanup function to abort active requests on component unmount
    return () => {
      activeRequests.forEach((abortController) => abortController.abort());
    };
  }, []);

  // Return the loading state, error state, sendRequest function, and clearError function
  return { isLoading, error, sendRequest, clearError };
};
