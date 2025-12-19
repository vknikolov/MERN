import React from "react";
import { NavLink } from "react-router-dom";
// CSS
import "./NavigationLinks.css";

const NavigationLinks = () => {
  return (
    <ul className="navigation-links">
      <li>
        <NavLink to="/" exact>All Users</NavLink>
      </li>
      <li>
        <NavLink to="/u1/places">My Places</NavLink>
      </li>
      <li>
        <NavLink to="/places/new">Add Places</NavLink>
      </li>
      <li>
        <NavLink to="/authenticate">Authenticate</NavLink>
      </li>
    </ul>
  );
};

export default NavigationLinks;
