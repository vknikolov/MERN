import React from "react";
// Components
import Card from "../../../shared/components/ui-elements/card/Card";
// CSS
import "./PlaceList.css";
import PlaceItem from "../place-item/PlaceItem";

const PlaceList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <button>Share Place</button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          imageUrl={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creatorId}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
