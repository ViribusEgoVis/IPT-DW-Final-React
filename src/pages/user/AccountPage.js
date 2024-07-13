import React, {useEffect, useState} from 'react';
import logo from '../../assets/logo.png';
import {Accordion, Alert, Button, Col, Container, Form, Row} from 'react-bootstrap';
import {updateUser} from "../../utils/UserService/updateUser";

const AccountPage = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [email, setEmail] = useState('');
    const [repeatEmail, setRepeatEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');

    const [genericError, setGenericError] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);

    const [activeAccordion, setActiveAccordion] = useState('0');

    const updated_data = {
        email: '',
        password: '',
        username: '',
    };

    useEffect(() => {

        setEmail(user.email)
        setUsername(user.username)
    }, [user]);
    const handleSaveChanges = (event) => {
        event.preventDefault();

        // Reset error states
        setGenericError('');
        setSuccessAlert(false);

        if (activeAccordion == null) return;
        // Validation based on active accordion
        switch (activeAccordion.toString()) {
            case '0':
                // Validate email
                if (email !== repeatEmail) {
                    setGenericError("Emails are not the same!");
                    return;
                }
                if (!isValidEmail(email)) {
                    setGenericError("Email not valid!");
                    return;
                }

                updated_data.email = email;
                updated_data.repeatEmail = repeatEmail;
                break;

            case '1':
                // Validate password
                if (password !== repeatPassword) {
                    setGenericError("Passwords are not the same!");
                    return;
                }
                if (password.length < 5 || password.length > 32) {
                    setGenericError("Password should be between 5 and 32 characters!");
                    return;
                }

                updated_data.password = password;
                updated_data.repeatPassword = repeatPassword;
                break;

            case '2':
                // Validate username
                if (!username) {
                    setGenericError(true);
                    return;
                }
                if (username.length < 3 || username > 32) {
                    setGenericError("Username should be between 3 and 32 characters!");
                    return;
                }

                updated_data.username = username;
                break;

            default:
                return;
        }
        console.log(updated_data)
        updateUser(activeAccordion, user, updated_data).then(ignore =>
            setSuccessAlert(true)
        )

    };

    // Function to check if the email has a valid format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    return (
        <>
            <Container className="mt-5 w-50">
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6} className="text-center">
                        <img src={logo} className="mb-4 w-50 h-auto" alt="Logo"/>
                    </Col>
                    <h2 className="mb-4">Account Settings</h2>
                    <Accordion defaultActiveKey={'0'} onSelect={(eventKey) => setActiveAccordion(eventKey)}>
                        {/* Email fields */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Email</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formRepeatEmail">
                                    <Form.Label>Repeat Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Repeat email"
                                        value={repeatEmail}
                                        onChange={(event) => setRepeatEmail(event.target.value)}
                                    />
                                </Form.Group>

                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Password fields */}
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Password</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formRepeatPassword">
                                    <Form.Label>Repeat Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Repeat password"
                                        value={repeatPassword}
                                        onChange={(event) => setRepeatPassword(event.target.value)}
                                    />
                                </Form.Group>

                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Username field */}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Username</Accordion.Header>
                            <Accordion.Body>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                                </Form.Group>

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button className="mt-2 w-95" variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Row>
                {successAlert &&
                    <Alert className={"m-2"} variant="success">Changes applied successfully!</Alert>}
                {genericError && <Alert className={"m-2"} variant="danger">{genericError}</Alert>}

            </Container>
        </>
    );
};

export default AccountPage;
