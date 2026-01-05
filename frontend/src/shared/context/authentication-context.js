import { createContext } from "react";

export const AuthenticationContext = createContext({
  isLoggedIn: false,
  userID: null,
  login: () => {},
  logout: () => {},
});