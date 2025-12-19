import React, { useState, useContext } from "react";
// Components
import Card from "../../../shared/components/ui-elements/card/Card";
import Button from "../../../shared/components/form-elements/button/Button";
import Modal from "../../../shared/components/modal/Modal";
import Map from "../../../shared/components/ui-elements/map/Map";
//Context
import { AuthenticationContext } from "../../../shared/context/authentication-context.js";
// CSS
import "./PlaceItem.css";

const PlaceItem = ({
  address,
  imageUrl,
  title,
  description,
  id,
  coordinates,
}) => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Map Modal handlers
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  // Confirm Delete Modal handlers
  const showConfirmModalHandler = () => setShowConfirmModal(true);
  const closeConfirmModalHandler = () => setShowConfirmModal(false);
  const deletePlaceHandler = () => {
    console.log("DELETING...");
    closeConfirmModalHandler();
  };

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        headerTitle={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footerChildren={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map coordinates={coordinates} className="" />
        </div>
      </Modal>

      <Modal
        headerTitle="Are you sure?"
        show={showConfirmModal}
        onCancel={closeConfirmModalHandler}
        footerClass="place-item__modal-actions"
        footerChildren={
          <>
            <Button inverse onClick={closeConfirmModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={deletePlaceHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>You want to delete this place? It can't be undone!</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={imageUrl} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW PLACE ON MAP
            </Button>
            {isLoggedIn && <Button to={`/places/${id}`}>EDIT</Button>}
            {isLoggedIn && (
              <Button danger onClick={showConfirmModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
