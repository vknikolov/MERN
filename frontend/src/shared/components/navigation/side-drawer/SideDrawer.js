import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
// CSS
import "./SideDrawer.css";

const SideDrawer = ({ children, show, onClick }) => {
  const content = (
    <CSSTransition
      in={show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={onClick}>
        {children}
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-root"));
};

export default SideDrawer;
