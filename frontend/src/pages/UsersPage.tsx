import { useEffect, useState } from "react";

interface User {
    id: number;
    username: string;
    email: string;
    organization: {
        organizationId: number;
        organizationName: string;
    };
    role: {
        roleId: number;
        roleName: string;
    };
}

const API_URL = "http://localhost:8080/api/users";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log('Received data:', data);
                setUsers(data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users && users.length > 0 ? (
                    users.map((user: User) => (
                        <li key={user.id}>
                            {user.username} - {user.organization.organizationName} ({user.role.roleName})
                        </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>
        </div>
    );
};

export default UsersPage;