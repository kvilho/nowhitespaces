import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/users";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error)); 
    }, []);

    return (
        <div>
        <h2>Users</h2>
        <ul>
          {users.map((user: any) => (
            <li key={user.userId}>{user.userName}</li>
          ))}
        </ul>
      </div>
    );
}

export default UsersPage;