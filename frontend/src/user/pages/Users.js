import React from "react";
// Components
import UsersList from "../components/users-list/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Max Schwarz",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/e/e9/Tallinn_2016_-_-i---i-_%2831601942076%29.jpg",
      places: 3,
    },
    {
      id: "u2",
      name: "Anna Müller",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/fc/Place_Jeanne_d%27Arc_in_Neufchateau_%282%29.jpg",
      places: 5,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
