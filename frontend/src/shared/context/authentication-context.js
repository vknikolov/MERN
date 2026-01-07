import { createContext } from "react";

export const AuthenticationContext = createContext({
  isLoggedIn: false,
  userID: null,
  token: null,
  login: () => {},
  logout: () => {},
});