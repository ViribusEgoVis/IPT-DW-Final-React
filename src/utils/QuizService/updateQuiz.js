export const updateQuiz = async (updatedQuiz, quizImage, questionImages) => {
    const formData = new FormData();

    formData.append('quizJson', JSON.stringify(updatedQuiz));


    if (quizImage) {
        formData.append('quizImage', quizImage, quizImage.name);
    }

    if (questionImages) {
        Object.values(questionImages).forEach((file) => {
            formData.append('questionImages', file, file.name);
        });
    }

    try {
        const response = await fetch(`https://localhost:7177/api/QuizApi/${updatedQuiz.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.title || 'Failed to update quiz');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating quiz:', error);
        throw error;
    }
};
