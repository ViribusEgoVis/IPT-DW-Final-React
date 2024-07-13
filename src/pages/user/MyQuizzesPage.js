import useFetchQuizzes from "../../utils/QuizService/useFetchQuizzes";
import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Card, Container, Modal} from "react-bootstrap";
import {deleteQuiz} from "../../utils/QuizService/deleteQuiz";

const MyQuizzesPage = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [isDeleting, setDeleting] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const url_base = "https://localhost:7177/uploads/";

    let data = useFetchQuizzes(user.id).data;

    useEffect(() => {
        if (data) {
            setLoading(false)
        }
    }, [data]);

    const handleClose = () => setShowModal(false);
    const handleShow = (quiz_id) => {
        setSelectedQuizId(quiz_id);
        setShowModal(true);
    };

    function handleDelete() {
        setDeleting(true)
        setShowModal(false)
        deleteQuiz(selectedQuizId).then(ignored => {
            data = data.filter(quiz => quiz.id !== selectedQuizId);
            // Update the data array with the filtered result
            setDeleting(false)

        })
    }

    if (isDeleting) {
        // Handle the case when quiz data is not available
        return (
            <div className="container text-center mt-5">
                <p className="lead">Please wait. Do not move from this page until its done. This might take a while</p>
            </div>
        );
    }
    return (
        <>
            <Container className="mt-4">
                <Card.Title className="text-center display-5 mb-2"
                            style={{fontFamily: 'Fredoka One, sans-serif'}}
                >
                    My Quizzes
                </Card.Title>
                <Card className="shadow-lg p-3 bg-white rounded ">

                    {isLoading ?
                        <div className="container text-center mt-5">
                            <p className="lead">Loading ...</p>
                        </div>
                        :
                        <div className={"align-items-center"}>
                            <div
                                style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {
                                    data?.map(quiz => (
                                        <div className={'quiz-card shadow-lg p-3 '}>
                                            {/* Add the splash image as the src attribute */}
                                            <img src={url_base + "/quizzes/" + quiz.splashImage} alt=""
                                                 className="quiz-splash"
                                                 style={{width: '100%'}}/>
                                            <h3>{quiz.title}</h3>
                                            <p>{quiz.desc}</p>

                                            <ButtonGroup className={'w-50 '}>
                                                <Button variant={"primary"}
                                                        href={`quiz/edit/${quiz.id}`}

                                                >
                                                    <i className="bi bi-pencil-square"></i> Edit
                                                </Button>

                                                <Button style={{maxWidth: '25%'}}
                                                        onClick={() => handleShow(quiz.id)}
                                                        variant={"danger"}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </Card>
            </Container>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MyQuizzesPage;
