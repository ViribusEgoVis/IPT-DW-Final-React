const deleteQuiz = async (quizId) => {
    const API_ENDPOINT = "https://localhost:7177/api/QuizApi";

    try {
        const response = await fetch(`${API_ENDPOINT}/${quizId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete quiz');
        }

        // Quiz successfully deleted
        return true;
    } catch (error) {
        console.error("Error deleting quiz:", error);
        throw error;
    }
};
