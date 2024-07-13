export const updateUser = async (choice, user, updated_data) => {
    const API_ENDPOINT = "https://localhost:7177/api/MembersApi/"; // Replace with your actual API URL

    let updateData = {
        id: user.id,
        email: '',
        password: '',
        username: ''
    };
    console.log(updated_data)
    switch (choice.toString()) {
        case '0':
            updateData.email = updated_data.email;
            break;
        case '1':
            updateData.password = updated_data.password;
            break;
        case '2':
            updateData.username = updated_data.username;
            break;
        default:
            throw Error('Invalid choice');
    }

    try {
        const response = await fetch(API_ENDPOINT + user.id, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Could not update the user');
        }

        // Update the user object with the new data
        const updatedUser = await response.json();
        // Update session storage
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
