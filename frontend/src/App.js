import React from "react";
// React Router v5
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// Pages
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace.js";
// Hooks
import { useAuthentication } from "./helpers/custom-hooks/authentication-hook.js";
// Components
import MainNavigation from "./shared/components/navigation/main-navigation/MainNavigation.js";
import Authentication from "./user/pages/Authentication.js";
// Context
import { AuthenticationContext } from "./shared/context/authentication-context.js";

const App = () => {
  // Use custom authentication hook
  const { token, login, logout, userID } = useAuthentication();

  // Define routes based on authentication status
  let authenticatedRoutes;
  if (token) {
    authenticatedRoutes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    authenticatedRoutes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/login" exact>
          <Authentication />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userID: userID,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{authenticatedRoutes}</main>
      </Router>
    </AuthenticationContext.Provider>
  );
};

export default App;
