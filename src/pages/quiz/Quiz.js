import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import useFetchFullQuiz from "../../utils/QuizService/useFetchFullQuiz";
import {Button, Card, Container, Image, Row} from "react-bootstrap";

const Quiz = () => {
    const [isLoading, setLoading] = useState(true)
    const quiz_id = useParams().id;
    const data = useFetchFullQuiz(quiz_id);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [isDisabled, setDisabled] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [rightAnswers, setRightAnswers] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const url_base = "https://localhost:7177/uploads/";

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }


    useEffect(() => {
        if (data) {
            setLoading(false)
        }
    }, [data]);

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
    };

    useEffect(() => {
        if (selectedAnswer !== null) {
            console.log("tEST1")
            console.log((selectedAnswer.correctAnswer) && !isDisabled)
            if ((selectedAnswer.correctAnswer) && !isDisabled) {
                setRightAnswers(rightAnswers + 1);
                console.log("TEST")
            }
            setDisabled(true)

            delay(2000).then(() => {
                // Check if an answer is selected before moving to the next question
                console.log(selectedAnswer)
                if (selectedAnswer !== null) {
                    // Move to the next question
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    // Reset the selected answer for the new question
                    setSelectedAnswer(null);
                }
            });
        }
    }, [selectedAnswer]);

    function shuffleAnswers(current_question) {
        const answers = current_question.answers
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        current_question.answers = answers
        return current_question;
    }

    useEffect(function () {
        if (data) {
            console.log(currentQuestionIndex, " >= ", data.questions.length)
            if (currentQuestionIndex >= data.questions.length) {
                setGameOver(true)
            } else {
                const shuffled_ans = shuffleAnswers(data.questions[currentQuestionIndex])
                setCurrentQuestion(shuffled_ans);
                console.log(shuffled_ans)
                setDisabled(false)

            }

        }
    }, [currentQuestionIndex, data]);

    if (isLoading) {
        // Handle the case when quiz data is not available
        return (
            <div className="container text-center mt-5">
                <p className="lead">Loading ...</p>
            </div>
        );
    }

    return (
        <>
            <Container className="mt-4">
                <Card className="shadow-lg p-3 bg-white rounded ">
                    <Card.Body>
                        {gameOver ?
                            <>
                                <Card.Title className="text-center display-5"
                                            style={{fontFamily: 'Fredoka One, sans-serif'}}
                                >
                                    End of Quiz
                                </Card.Title>
                                <Row className='d-block justify-content-center text-center'>
                                    You got {rightAnswers} out of {data.questions.length} questions right!
                                    {rightAnswers / data.questions.length > 0.50 ?
                                        <><br/>Well done!</>
                                        :
                                        <><br/>Better luck next time!</>}
                                    <br/>
                                    <Button className={'w-25'}
                                            variant={"outline-secondary"}
                                            href="/home"
                                    >
                                        Return to Home
                                    </Button>

                                </Row>
                            </> :
                            (currentQuestion ?
                                    <>
                                        <Card.Title className="text-center">{currentQuestion.text}</Card.Title>
                                        {currentQuestion.splashImage &&
                                            <div className={"splash-container"}><Image
                                                src={url_base + "/questions/" + currentQuestion.splashImage}
                                                alt=""
                                                className="quiz-splash "
                                                style={{width: '75%'}}
                                            /></div>
                                        }

                                        <Row className='d-block justify-content-center text-center'>
                                            {currentQuestion.answers.map((answer, index) => (
                                                <Button
                                                    key={index}
                                                    variant={
                                                        selectedAnswer === answer
                                                            ? answer.correctAnswer
                                                                ? 'success'
                                                                : 'danger'
                                                            : answer.correctAnswer && isDisabled
                                                                ? 'success'
                                                                : 'outline-primary'
                                                    }

                                                    onClick={() => handleAnswerClick(answer)}
                                                    className='w-75 mx-auto m-2'
                                                    disabled={isDisabled}
                                                >
                                                    {answer.text}
                                                    {selectedAnswer === answer
                                                        ? answer.correctAnswer
                                                            ? <i className="ml-1 bi bi-check-lg"></i>
                                                            : <i className="ml-1 bi bi-x-lg"></i>
                                                        : answer.correctAnswer && isDisabled
                                                            ? <i className="ml-1 bi bi-check-lg"></i>
                                                            : ''
                                                    }
                                                </Button>
                                            ))}
                                        </Row>
                                    </>
                                    :
                                    <></>
                            )
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>

    );

}
export default Quiz;
