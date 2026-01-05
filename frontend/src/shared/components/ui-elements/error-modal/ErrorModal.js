import React from "react";

import Modal from "../../../components/modal/Modal";
import Button from "../../../components/form-elements/button/Button";

const ErrorModal = ({ error, onClear }) => {
  return (
    <Modal
      onCancel={onClear}
      headerTitle="An Error Occurred!"
      show={!!error}
      footerChildren={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
