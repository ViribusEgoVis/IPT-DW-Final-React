import React, {useRef, useState} from "react";
import {Accordion, Button, Col, Container, Form, Row} from 'react-bootstrap';
import {createQuiz} from '../../utils/QuizService/createQuiz';

const CreateQuiz = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        AuthorId: user.id,
        questions: []
    });
    const [quizImage, setQuizImage] = useState(null);
    const [questionImages, setQuestionImages] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleQuizChange = (event) => {
        setQuizData({...quizData, [event.target.name]: event.target.value});
    };

    const handleQuizImageChange = (event) => {
        setQuizImage(event.target.files[0]);
    };

    const handleQuestionImageChange = (questionId, event) => {
        setQuestionImages({...questionImages, [questionId]: event.target.files[0]});
    };

    const handleAddQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {text: '', answers: [{text: '', CorrectAnswer: false}]}
            ]
        });
    };

    const handleQuestionChange = (questionIndex, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex][field] = value;
        setQuizData({...quizData, questions: newQuestions});
    };

    const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].answers[answerIndex][field] = value;
        setQuizData({...quizData, questions: newQuestions});
    };

    const handleAddAnswer = (questionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].answers.push({text: '', CorrectAnswer: false});
        setQuizData({...quizData, questions: newQuestions});
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createQuiz(quizData, quizImage, questionImages);
            console.log('Quiz created:', result);
            // Handle successful creation (e.g., show a success message, redirect)
        } catch (err) {
            setError(err.message || 'An error occurred while creating the quiz');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-3">
            <Row className="shadow-sm rounded p-3">
                <Col md={6} className="h-100">
                    <Form.Label><b>Title</b></Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={quizData.title}
                        onChange={handleQuizChange}
                    />
                    <Form.Label className="mt-3"><b>Description</b></Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={quizData.description}
                        rows={3}
                        onChange={handleQuizChange}
                    />
                    <Form.Label className="mt-3"><b>Quiz Image</b></Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleQuizImageChange}
                        ref={fileInputRef}
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="mt-3"><b>Questions</b></Form.Label>
                    <Accordion>
                        {quizData.questions.map((question, questionIndex) => (
                            <Accordion.Item eventKey={questionIndex} key={question.id}>
                                <Accordion.Header>Question {questionIndex + 1}</Accordion.Header>
                                <Accordion.Body>
                                    <Form.Control
                                        type="text"
                                        placeholder="Question text"
                                        value={question.text}
                                        onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                                    />
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => handleQuestionImageChange(question.id, e)}
                                        className="mt-2"
                                    />
                                    <Form.Label className="mt-3"><b>Answers</b></Form.Label>
                                    {question.answers.map((answer, answerIndex) => (
                                        <Row key={answer.id} className="mb-2">
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Answer text"
                                                    value={answer.text}
                                                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, 'text', e.target.value)}
                                                />
                                            </Col>
                                            <Col xs="auto">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Correct"
                                                    checked={answer.CorrectAnswer}
                                                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, 'CorrectAnswer', e.target.checked)}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button onClick={() => handleAddAnswer(questionIndex)} size="sm" className="mt-2">
                                        Add Answer
                                    </Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                    <Button onClick={handleAddQuestion} className="mt-3">Add Question</Button>
                </Col>
                <Button onClick={handleSubmit} className="mt-3" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Quiz'}
                </Button>
                {error && <p className="text-danger">{error}</p>}
            </Row>
        </Container>
    );
};

export default CreateQuiz;
