import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import React from "react";

export const QuizCard = ({quiz}) => {
    const navigate = useNavigate()
    const url_base = "https://localhost:7177/uploads/";
    const handleCLick = () => {
        navigate('/quiz/' + quiz.id)
    }

    return (
        <div className={'quiz-card'}>
            <img src={url_base + "/quizzes/" + quiz.splashImage} alt="" className="quiz-splash"
                 style={{width: '100%'}}/>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <p className={"author"}><strong>Author:</strong> {quiz.author}</p>
            {/* Display up to 6 tags */}
            <div className="tags mb-2">
                {quiz.tags && quiz.tags.slice(0, 6).map((quizTag, index) => (
                    <span key={index} className="badge bg-secondary me-1">{quizTag}</span>
                ))}
            </div>
            <Button className={"start-button"} onClick={handleCLick}>Start Quiz</Button>
        </div>
    );
};