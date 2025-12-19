import React, { useState } from "react";
import { Link } from "react-router-dom";
// Components
import MainHeader from "../main-header/MainHeader";
import SideDrawer from "../side-drawer/SideDrawer";
import Backdrop from "../backdrop/Backdrop";
//CSS
import "./MainNavigation.css";
import NavigationLinks from "../navigation-links/NavigationLinks";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const showDrawerHandler = () => {
    setDrawerIsOpen(true);
  };
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  
  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      {drawerIsOpen && (
        <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
          <nav className="main-navigation__drawer-nav">
            <NavigationLinks />
          </nav>
        </SideDrawer>
      )}
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={showDrawerHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Logo</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavigationLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
