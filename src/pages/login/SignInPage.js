import React, {useState} from 'react';
import {Alert, Button, Col, Container, Form, Row} from 'react-bootstrap';
import logo from '../../assets/logo.png';
import useFetchUsers from "../../utils/UserService/useFetchUsers";
import {useNavigate} from "react-router-dom";

const SignInPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setAlert] = useState(false);
    const {data, error} = useFetchUsers(username, password);
    const navigate = useNavigate()
    const handleLogin = (event) => {
        event.preventDefault();
        if (error == null) {
            sessionStorage.setItem("isAuthed", 'true');
            sessionStorage.setItem("user", JSON.stringify(data));
            navigate("/home");
        } else {
            setAlert(true)
        }

    };
    return (
        <>
            <Container className="mt-5 w-50">
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6} className="text-center">
                        {/* Big centered logo */}
                        <img
                            src={logo}
                            className="mb-4 w-50 h-auto"
                        />
                    </Col>
                    <h2 className="mb-4">Log In</h2>

                    {/* Display alert for invalid credentials */}
                    {showAlert && (
                        <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                            Invalid credentials. Please try again.
                        </Alert>
                    )}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </Form.Group>
                        <Button className={"mt-2"} variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>

                </Row>
            </Container>
        </>
    );
};

export default SignInPage;
