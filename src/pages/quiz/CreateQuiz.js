// Importing required modules and components
import React, {Fragment, useState} from "react";
import {Accordion, Button, ButtonGroup, Col, Container, Form, Image, Row} from 'react-bootstrap';

// Main component
const CreateQuiz = () => {

    /*
     *
     * COMPONENTE INACABADO
     * TODO: Acabar COMPONENTE
     *
     */


    // Initializing state for updated data
    const [updated_data, setUpdated_data] = useState(null);

    const [newQuestion, setNewQuestion] = useState(null);

    // Handler for changes to the quiz
    const handleQuizChange = (event) => {
        const newData = {...updated_data, [event.target.name]: event.target.value};
        setUpdated_data(newData);
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
    }

    // Handler for changes to the correct answer checkbox
    const handleCheckboxChange = (event, questionId, answerId) => {

        if (event.target.name === 'isCorrect' && !event.target.checked) {
            return;
        }

        const newQuestions = updated_data.questions.map(q =>
            q.id === questionId ? {
                ...q,
                correctAnswer: answerId
            } : q
        );
        const newData = {...updated_data, questions: newQuestions};
        setUpdated_data(newData);
    }

    // Function to save changes to the server
    const saveChanges = async () => {
    }

    // Function to reset changes
    const resetChanges = () => {
        setUpdated_data(null)
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
                        value={updated_data?.title}
                        onChange={(event) => handleQuizChange(event)}
                    />
                    <Form.Label className={"mt-3"}><b>Description</b></Form.Label>
                    <Form.Control as="textarea" type={"text"}
                                  name={"desc"}
                                  value={updated_data?.desc}
                                  rows={3}
                                  onChange={(event) => handleQuizChange(event)}
                    />
                    <Form.Label className={"mt-3"}><b>Splash Image</b></Form.Label>
                    <Image className={"shadow quiz- w-100"} src={updated_data?.splashImage}/>
                    <Form.Control
                        style={{borderRadius: "0px 0px 5px 5px"}}
                        type="text"
                        name={"splashImage"}
                        placeholder=""
                        value={updated_data?.splashImage}
                        onChange={(event) => handleQuizChange(event)}
                        maxLength={50000}
                    />

                </Col>
                <Col md={6}>
                    <Form.Label className={"mt-3"}><b>Questions</b></Form.Label>

                    <Accordion>
                        {updated_data?.questions?.map(question => (
                            <Accordion.Item eventKey={question?.id} key={question.id}>
                                <Accordion.Header>{question?.id - 1}</Accordion.Header>
                                <Accordion.Body>
                                    <Form.Group>
                                        <Form.Label><b>Text</b></Form.Label>
                                        <Form.Control as="textarea"
                                                      type={"text"}
                                                      name={"text"}
                                                      value={question?.text}
                                                      rows={3}
                                                      onChange={(event) => handleQuestionChange(event, question.id)}
                                        />

                                        <Form.Label className={"mt-3"}><b>Splash Image</b></Form.Label>
                                        <Image className={"shadow quiz- w-100"} src={question?.splashImage}/>
                                        <Form.Control
                                            style={{borderRadius: "0px 0px 5px 5px"}}
                                            className={"mb-2"}
                                            type="text"
                                            name={"splashImage"}
                                            placeholder=""
                                            value={question?.splashImage}
                                            onChange={(event) => handleQuestionChange(event, question.id)}
                                            maxLength={50000}
                                        />

                                        {question.answers.map(answer => (
                                            <Fragment key={answer.id}>
                                                <ButtonGroup className={"w-100 m-1"}>
                                                    <Form.Control
                                                        className={"w-95"}
                                                        type="text"
                                                        name={"text"}
                                                        placeholder=""
                                                        value={answer?.text}
                                                        onChange={(event) => handleAnswerChange(event, question.id, answer.id)}
                                                    />
                                                    <Form.Check
                                                        type="checkbox"
                                                        className={"p-2"}
                                                        name={`isCorrect`}
                                                        checked={(answer.id === question.correctAnswer)}
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
                        <Accordion.Item eventKey={'1'}>
                            <Accordion.Header>New Question</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group>
                                    <Form.Label><b>Text</b></Form.Label>
                                    <Form.Control as="textarea" type={"text"}

                                                  name={"text"}
                                                  value={newQuestion?.text}
                                                  rows={3}
                                                  onChange={(event) => handleQuestionChange(event, newQuestion.id)}
                                    />

                                    <Form.Label className={"mt-3"}><b>Splash Image</b></Form.Label>
                                    {newQuestion?.splashImage &&
                                        <Image className={"shadow quiz- w-100"} src={newQuestion?.splashImage}/>}
                                    <Form.Control
                                        style={{borderRadius: "0px 0px 5px 5px"}}
                                        className={"mb-2"}
                                        type="text"
                                        name={"splashImage"}
                                        placeholder=""
                                        value={newQuestion?.splashImage}
                                        onChange={(event) => handleQuestionChange(event, newQuestion.id)}
                                        maxLength={50000}
                                    />

                                    <Form.Label className={"mt-3"}><b>Answers</b></Form.Label>

                                    {Array(4).fill().map((_, i) => (
                                        <Fragment key={i}>
                                            <ButtonGroup className={"w-100 m-1"}>
                                                <Form.Control
                                                    className={"w-95"}
                                                    type="text"
                                                    name={"text"}
                                                    placeholder=""
                                                    onChange={(event) => handleAnswerChange(event, newQuestion.id)}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    className={"p-2"}
                                                    name={`isCorrect`}
                                                    onChange={(event) => handleCheckboxChange(event, newQuestion.id)}
                                                />
                                            </ButtonGroup>
                                        </Fragment>
                                    ))}
                                </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <ButtonGroup className={"mt-3"}>
                    <Button className={"w-95"} variant="primary" type="submit" onClick={saveChanges}>
                        Submit
                    </Button>
                    {updated_data !== null &&
                        <Button style={{width: "2%"}} variant="danger" onClick={resetChanges}>
                            <i className=" bi-x-square"></i>
                        </Button>
                    }
                </ButtonGroup>
            </Row>
        </Container>
    </>)
}
export default CreateQuiz;