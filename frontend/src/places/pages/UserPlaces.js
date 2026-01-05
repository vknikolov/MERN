import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Components
import PlaceList from "../components/place-list/PlaceList";
import ErrorModal from "../../shared/components/ui-elements/error-modal/ErrorModal";
import LoadingSpinner from "../../shared/components/ui-elements/spinner/LoadingSpinner";
// Hooks
import { useHttpClient } from "../../helpers/custom-hooks/http.js";

const UserPlaces = () => {
  // State to hold loaded places
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  // useHttpClient for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Get userId from URL parameters
  const { userId } = useParams();

  useEffect(() => {
    // Fetch places for the specific user
    const fetchUserPlaces = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:8080/api/places/user/${userId}`
        );
        // Update state with fetched places
        setLoadedPlaces(data.places);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
