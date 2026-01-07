import React, { useState, useEffect } from "react";
// Components
import UsersList from "../components/users-list/UsersList";
import ErrorModal from "../../shared/components/ui-elements/error-modal/ErrorModal";
import LoadingSpinner from "../../shared/components/ui-elements/spinner/LoadingSpinner";
// Hooks
import { useHttpClient } from "../../helpers/custom-hooks/http.js";

const Users = () => {
  // useHttpClient for handling HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // State to store loaded users
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    // Fetch users on component mount
    const fetchUsers = async () => {
      try {
        // Send HTTP request to fetch users
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
        setLoadedUsers(data.users);
      } catch (error) {
        // Error handling is managed in useHttpClient
        console.error(error);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      {error && <ErrorModal onClear={clearError} message={error} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
