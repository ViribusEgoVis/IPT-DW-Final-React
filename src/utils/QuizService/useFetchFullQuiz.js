import {useEffect, useState} from "react";

const useFetchFullQuiz = (quiz_id) => {
    const [data, setData] = useState(null);
    const API_ENDPOINT = "https://localhost:7177/api/QuizApi";

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(API_ENDPOINT);
                if (!response.ok) {
                    throw new Error('Could not fetch the data');
                }
                const quizzes = await response.json();

                if (quiz_id) {
                    const selectedQuiz = quizzes.find(quiz => quiz.id === parseInt(quiz_id));
                    setData(selectedQuiz);
                } else {
                    setData(quizzes);
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, [quiz_id]);

    return data;
};

export default useFetchFullQuiz;
