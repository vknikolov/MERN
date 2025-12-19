import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
//Components
import Button from "../../form-elements/button/Button.js";
// Context
import { AuthenticationContext } from "../../../context/authentication-context.js";
// CSS
import "./NavigationLinks.css";

const NavigationLinks = () => {
  const { isLoggedIn, logout } = useContext(AuthenticationContext);

  return (
    <ul className="navigation-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to="/u1/places">My Places</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Places</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/authenticate">Login</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <Button onClick={logout}>Logout</Button>
        </li>
      )}
    </ul>
  );
};

export default NavigationLinks;
