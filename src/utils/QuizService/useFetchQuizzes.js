import {useEffect, useState} from "react";

const useFetchQuizzes = (authorId) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const API_ENDPOINT = "https://localhost:7177/api/QuizApi";

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const url = authorId ? `${API_ENDPOINT}?authorId=${authorId}` : API_ENDPOINT;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Could not fetch the data');
                }
                const result = await response.json();
                console.log(result);

                if (result.length > 0) {
                    setData(result);
                } else {
                    setError("No Quizzes were Found!");
                }
            } catch (error) {
                console.log(error.message);
                setError(error.message);
            }
        };

        fetchQuizzes();
    }, [authorId]);

    return {data, error};
};

export default useFetchQuizzes;
