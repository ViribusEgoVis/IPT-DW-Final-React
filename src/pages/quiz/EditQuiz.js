// Importing required modules and components
import React, {Fragment, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import useFetchFullQuiz from "../../utils/QuizService/useFetchFullQuiz";
import {Accordion, Button, ButtonGroup, Col, Container, Form, Image, Row} from 'react-bootstrap';
import {updateQuiz} from "../../utils/QuizService/updateQuiz";

// Main component
const EditQuiz = () => {
    // Setting initial loading state
    const [isLoading, setLoading] = useState(true)
    // Getting the id of the quiz from the URL parameters
    const quiz_id = useParams().id;
    // Fetching full quiz data
    let data = useFetchFullQuiz(quiz_id);
    // Initializing state for updated data
    const [updated_data, setUpdated_data] = useState(null);
    // Initializing state for changes made to the quiz
    const [changes, setChanges] = useState(null);
    const quizImageInputRef = useRef(null);
    const questionImageInputRefs = useRef({});
    const [quizImagePreview, setQuizImagePreview] = useState(null);
    const [questionImagePreviews, setQuestionImagePreviews] = useState({});

    // Base url for any image files
    const url_base = "https://localhost:7177/uploads/";

    // Setting loading state to false once data is fetched
    useEffect(() => {
        if (data) {
            setLoading(false)
            setUpdated_data(data)
        }
    }, [data]);

    // Logging updated data and changes to the console
    useEffect(() => {
        console.log(updated_data)
        console.log(changes)
    }, [updated_data]);

    const handleQuizImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuizImagePreview(reader.result);
                const newData = {...updated_data, splashImage: file.name};
                setUpdated_data(newData);
                setChanges(prevChanges => ({
                    ...prevChanges,
                    quiz: [newData],
                    quizImage: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuestionImageChange = (event, questionId) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuestionImagePreviews(prev => ({
                    ...prev,
                    [questionId]: reader.result
                }));
                const newQuestions = updated_data.questions.map(q =>
                    q.id === questionId ? {...q, splashImage: file.name} : q
                );
                const newData = {...updated_data, questions: newQuestions};
                setUpdated_data(newData);
                setQuestionChanges(newData, questionId);
                setChanges(prevChanges => ({
                    ...prevChanges,
                    questionImages: {
                        ...prevChanges?.questionImages,
                        [questionId]: file
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handler for changes to the quiz
    const handleQuizChange = (event) => {
        const newData = {...updated_data, [event.target.name]: event.target.value};
        setUpdated_data(newData);
        setChanges(prevChanges => ({
            ...prevChanges,
            quiz: newData
        }));
    }

    // Handler for changes to a question
    const setQuestionChanges = (newData, questionId) => {
        setChanges(prevChanges => {

            const existingIndex = prevChanges?.questions ? prevChanges.questions.findIndex(q => q.id === questionId) : -1;
            console.log(existingIndex)
            let updatedQuestions = prevChanges?.questions ? [...prevChanges.questions] : [];

            if (existingIndex > -1) {
                // Question exists, replace it
                updatedQuestions[existingIndex] = newData.questions.find(q => q.id === questionId);
            } else {
                // Question doesn't exist, add it
                updatedQuestions.push(newData.questions.find(q => q.id === questionId));
            }

            return {
                ...prevChanges,
                questions: updatedQuestions
            };
        });
    }

    // Handler for changes to an answer
    const setAnswerChanges = (newData, questionId, answerId) => {
        setChanges(prevChanges => {
            const question = newData.questions.find(q => q.id === questionId);
            if (!question) {
                console.error(`Question with id ${questionId} not found`);
                return prevChanges;
            }

            const answer = question.answers.find(a => a.id === answerId);
            if (!answer) {
                console.error(`Answer with id ${answerId} not found in question ${questionId}`);
                return prevChanges;
            }

            let updatedAnswers = prevChanges?.answers ? [...prevChanges.answers] : [];
            const existingIndex = updatedAnswers.findIndex(a => a.id === answerId);

            if (existingIndex > -1) {
                updatedAnswers[existingIndex] = answer;
            } else {
                updatedAnswers.push(answer);
            }

            return {
                ...prevChanges,
                answers: updatedAnswers
            };
        });
    }


    // Handler for changes to a question
    const handleQuestionChange = (event, questionId) => {

        const newQuestions = updated_data.questions.map(q =>
            q.id === questionId ? {
                ...q,
                [event.target.name]: event.target.value
            } : q
        );
        const newData = {...updated_data, questions: newQuestions};
        setUpdated_data(newData);
        setQuestionChanges(newData, questionId)

    }

    // Handler for changes to an answer
    const handleAnswerChange = (event, questionId, answerId) => {
        const newAnswers = updated_data.questions.map(q =>
            q.id === questionId ? {
                ...q,
                answers: q.answers.map(a =>
                    a.id === answerId ? {
                        ...a,
                        [event.target.name]: event.target.value
                    } : a
                )
            } : q
        );
        console.log(newAnswers)
        const newData = {...updated_data, questions: newAnswers};
        setUpdated_data(newData);
        setAnswerChanges(newData, questionId, answerId)
    }

    // Handler for changes to the correct answer checkbox
    const handleCheckboxChange = (event, questionId, answerId) => {
        const newQuestions = updated_data.questions.map(q =>
            q.id === questionId ? {
                ...q,
                answers: q.answers.map(a => ({
                    ...a,
                    correctAnswer: a.id === answerId
                }))
            } : q
        );

        const newData = {...updated_data, questions: newQuestions};
        setUpdated_data(newData);
        setQuestionChanges(newData, questionId);
    }


    // Function to save changes to the server
    const saveChanges = async () => {
        setLoading(true);
        try {
            const updatedQuiz = {
                ...updated_data,
                questions: updated_data.questions.map(q => ({
                    ...q,
                    answers: q.answers.map(a => ({
                        ...a,
                        correctAnswer: Boolean(a.correctAnswer)
                    }))
                }))
            };
            await updateQuiz(updatedQuiz, changes.quizImage, changes.questionImages);
            setChanges(null);
            console.log("Changed!");
            console.log(updatedQuiz);
            data = updatedQuiz;
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setLoading(false);
        }
    }


    // Function to reset changes
    const resetChanges = () => {
        setChanges(null);
        setUpdated_data(data)
    }

    // Rendering the component
    if (isLoading) {
        // Loading state
        return (
            <div className="container text-center mt-5">
                <p className="lead">Loading ...</p>
            </div>
        );
    }

    return (<>
        <Container className={"mt-3 "}>
            <Row className={"shadow-sm rounded p-3"}>
                <Col md={6} className={"h-100"}>

                    <Form.Label><b>Title</b></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder=""
                        name={"title"}
                        value={updated_data.title}
                        onChange={(event) => handleQuizChange(event)}
                    />
                    <Form.Label className={"mt-3"}><b>Description</b></Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        name="description"
                        value={updated_data.description}
                        rows={3}
                        onChange={(event) => handleQuizChange(event)}
                    />

                    <Form.Label className={"mt-3"}><b>Splash Image</b></Form.Label>
                    <Image
                        className={"shadow quiz- w-100"}
                        src={quizImagePreview || (url_base + "/quizzes/" + updated_data.splashImage)}
                    />
                    <Form.Control
                        ref={quizImageInputRef}
                        style={{display: 'none'}}
                        type="file"
                        accept="image/*"
                        onChange={handleQuizImageChange}
                    />
                    <Button
                        variant="outline-primary"
                        onClick={() => quizImageInputRef.current.click()}
                        className="mt-2 w-100"
                    >
                        Change Quiz Image
                    </Button>

                </Col>
                <Col md={6}>
                    <Form.Label className={"mt-3"}><b>Questions</b></Form.Label>

                    <Accordion>
                        {updated_data?.questions.map(question => (
                            <Accordion.Item eventKey={question.id} key={question.id}>
                                <Accordion.Header>{question.id}</Accordion.Header>
                                <Accordion.Body>
                                    <Form.Group>
                                        <Form.Label><b>Text</b></Form.Label>
                                        <Form.Control as="textarea" type={"text"}

                                                      name={"text"}
                                                      value={question.text}
                                                      rows={3}
                                                      onChange={(event) => handleQuestionChange(event, question.id)}
                                        />

                                        <Form.Label className={"mt-3"}><b>Splash Image</b></Form.Label>
                                        <Image
                                            className={"shadow quiz- w-100"}
                                            src={questionImagePreviews[question.id] || (url_base + "questions/" + question.splashImage)}
                                        />
                                        <Form.Control
                                            ref={el => questionImageInputRefs.current[question.id] = el}
                                            style={{display: 'none'}}
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => handleQuestionImageChange(event, question.id)}
                                        />
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => questionImageInputRefs.current[question.id].click()}
                                            className="mt-2 w-100"
                                        >
                                            Change Question Image
                                        </Button>

                                        {question.answers.map(answer => (
                                            <Fragment key={answer.id}>
                                                <ButtonGroup className={"w-100 m-1"}>
                                                    <Form.Control
                                                        className={"w-95"}
                                                        type="text"
                                                        name={"text"}
                                                        placeholder=""
                                                        value={answer.text}
                                                        onChange={(event) => handleAnswerChange(event, question.id, answer.id)}
                                                    />
                                                    <Form.Check
                                                        type="checkbox"
                                                        className={"p-2"}
                                                        name={`isCorrect`}
                                                        checked={(answer.correctAnswer)}
                                                        onChange={(event) => handleCheckboxChange(event, question.id, answer.id)}
                                                    />
                                                </ButtonGroup>
                                            </Fragment>
                                        ))}
                                    </Form.Group>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                        }
                    </Accordion>
                </Col>
                <ButtonGroup className={"mt-3"}>
                    <Button className={"w-95"} variant="primary" type="submit" onClick={saveChanges}>
                        Submit
                    </Button>
                    {changes !== null &&
                        <Button style={{width: "2%"}} variant="danger" onClick={resetChanges}>
                            <i className=" bi-x-square"></i>
                        </Button>
                    }
                </ButtonGroup>
            </Row>
        </Container>
    </>)
}
export default EditQuiz;