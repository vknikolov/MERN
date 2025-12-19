import React from "react";
// CSS
import "./Map.css";

const Map = ({ className, style, coordinates }) => {
  return (
    <div className={`map ${className}`} style={style}>
      <p className="center">
        Map coordinates are: Lat: {coordinates.lat}, Lng: {coordinates.lng}
      </p>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/13/Orlando-Ferguson-flat-earth-map_edit.jpg"
        alt="Flat Earth Map"
      />
    </div>
  );
};

export default Map;
