import { useState, useEffect, useCallback } from "react";

let logoutTimer;
// Custom hook for managing authentication state
export const useAuthentication = () => {
  const [userID, setUserID] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  // Login function with useCallback to prevent unnecessary re-creations
  const login = useCallback((userID, token, expirationDate) => {
    setUserID(userID);
    setToken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour from now

    setTokenExpiration(tokenExpirationDate);
    // Store user data in localStorage for persistence
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userID,
        token,
        expiration: tokenExpirationDate.toISOString(), // Store expiration time as ISO string
      })
    );
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUserID(null); // Clear userID on logout
    setToken(null); // Clear token on logout
    setTokenExpiration(null); // Clear token expiration on logout
    localStorage.removeItem("userData"); // Remove user data from localStorage on logout
  }, []);

  // Auto logout when token expires
  useEffect(() => {
    if (token && tokenExpiration) {
      // Calculate remaining time until token expiration
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      // Set timer to auto logout
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      // Clear any existing logout timer if no token
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiration]);

  // Check for existing user data in localStorage on app load
  useEffect(() => {
    // Check localStorage for user data on app load
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // Check if token is still valid
    ) {
      login(
        storedData.userID,
        storedData.token,
        new Date(storedData.expiration) // Pass expiration date
      );
    }
  }, [login]);

  return { token, login, logout, userID };
};
