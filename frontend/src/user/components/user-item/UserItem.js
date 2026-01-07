import React from "react";
import { Link } from "react-router-dom";

// Components
import Avatar from "../../../shared/components/ui-elements/avatar/Avatar.js";
import Card from "../../../shared/components/ui-elements/card/Card.js";

// CSS
import "./UserItem.css";

const UserItem = ({ id, image, name, placeCount }) => {
  return (
    <li id={id} className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:8080/${image}`} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {`Place${placeCount === 1 ? "" : "s"}`}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
