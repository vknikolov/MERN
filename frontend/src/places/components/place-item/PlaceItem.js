import { useState, useContext } from "react";
// Components
import Card from "../../../shared/components/ui-elements/card/Card";
import Button from "../../../shared/components/form-elements/button/Button";
import Modal from "../../../shared/components/modal/Modal";
import Map from "../../../shared/components/ui-elements/map/Map";
import ErrorModal from "../../../shared/components/ui-elements/error-modal/ErrorModal.js";
import LoadingSpinner from "../../../shared/components/ui-elements/spinner/LoadingSpinner.js";
// Hooks
import { useHttpClient } from "../../../helpers/custom-hooks/http.js";
//Context
import { AuthenticationContext } from "../../../shared/context/authentication-context.js";
// CSS
import "./PlaceItem.css";

const PlaceItem = ({
  id,
  address,
  imageUrl,
  title,
  description,
  creatorId,
  coordinates,
  onDelete,
}) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userID } = useContext(AuthenticationContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Map Modal handlers
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  // Delete Confirmation Modal handlers
  const showConfirmModalHandler = () => setShowConfirmModal(true);
  const closeConfirmModalHandler = () => setShowConfirmModal(false);

  // Delete place handler
  const deletePlaceHandler = async () => {
    console.log("DELETING...");
    closeConfirmModalHandler();
    try {
      await sendRequest(`http://localhost:8080/api/places/${id}`, "DELETE");
      onDelete(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
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
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:8080/${imageUrl}`} alt={title} />
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
            {userID === creatorId && <Button to={`/places/${id}`}>EDIT</Button>}
            {userID === creatorId && (
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
