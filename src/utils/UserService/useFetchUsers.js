import {useEffect, useState} from 'react';

const useFetchUsers = (username, password) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const API_ENDPOINT = "https://localhost:7177/api/MembersApi";

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let response;
                if (username && password) {
                    console.log("Okay! ", username, ", ", password)
                    // Login
                    response = await fetch(`${API_ENDPOINT}/Login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({Email: username, Username: username, Password: password}),
                    });
                    console.log(response)
                } else {
                    // Fetch all users
                    response = await fetch(API_ENDPOINT);
                }

                if (!response.ok) {
                    throw new Error('Could not fetch the data');
                }

                const result = await response.json();

                if (username && password) {
                    setData(result); // Single user for login
                } else {
                    setData(result); // Array of users
                }
                setError(null);
            } catch (error) {
                setError(error.message);
                setData(null);
            }
        };

        fetchUsers();
    }, [username, password]);

    return {data, error};
};

export default useFetchUsers;
