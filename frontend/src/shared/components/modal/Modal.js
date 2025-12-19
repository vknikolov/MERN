import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
//Components
import Backdrop from "../navigation/backdrop/Backdrop";
// CSS
import "./Modal.css";

const ModalOverlay = ({
  style,
  className,
  headerClass,
  contentClass,
  footerClass,
  headerTitle,
  onSubmit,
  children,
  footerChildren,
}) => {
  const content = (
    <div className={`modal ${className}`} style={style}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{headerTitle}</h2>
      </header>
      <form onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>
          {footerChildren}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-root"));
};

const Modal = ({ show, onCancel, ...overlayProps }) => {
  return (
    <>
      {show && <Backdrop onClick={onCancel} />}
      <CSSTransition
        in={show}
        timeout={200}
        classNames="modal"
        mountOnEnter
        unmountOnExit
      >
        <ModalOverlay {...overlayProps} />
      </CSSTransition>
    </>
  );
};

export default Modal;
