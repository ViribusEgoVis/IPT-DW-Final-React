import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Dropdown, Form, InputGroup, Navbar} from 'react-bootstrap';
import logo from '../assets/logo.png';
import {useNavigate} from "react-router-dom";
import {FaSearch} from "react-icons/fa";

function Header({onSearchChange, toggleSearch}) {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        // Fetch user data from sessionStorage and update state only once during component mount
        const userData = JSON.parse(sessionStorage.getItem('user'));
        setUser(userData);
    }, []);

    // Check if is authenticated, if not, redirect to the login page
    const handleLogout = () => {
        sessionStorage.removeItem('isAuthed');
        sessionStorage.removeItem('user');
        navigate('/login')
    };

    // Handle search data
    const handleSearch = (value) => {
        setSearch(value)
        onSearchChange(value)
    }

    return (
        <Navbar className="bg-body-tertiary" expand="lg">
            <Container>
                <Navbar.Brand href="/home"
                              style={{fontFamily: 'Fredoka One, sans-serif', fontSize: '22px'}}>
                    <img
                        src={logo}
                        className="d-inline-block align-top h-auto m-0"
                        style={{width: '3rem'}}
                    />
                    {' Quize'}
                </Navbar.Brand>

                {toggleSearch !== false ? (
                    <ButtonGroup inline="true">
                        <InputGroup>
                            <InputGroup.Text><FaSearch/></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search quizzes..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </InputGroup>
                        <Button variant="primary" href={"/quiz/create"}
                                style={{fontSize: '1rem', display: 'flex', alignItems: 'center'}}>
                            Create
                            <i className="bi bi-plus-square"
                               style={{fontSize: '1rem', paddingLeft: '5px'}}>
                            </i>
                        </Button>
                    </ButtonGroup>
                ) : null

                }


                {user != null ? (
                    <ButtonGroup>
                        <Dropdown>
                            <Dropdown.Toggle variant={"light"} id="dropdown-basic">
                                {user.username}
                            </Dropdown.Toggle>
                            <Dropdown.Divider/>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/account">Account</Dropdown.Item>
                                <Dropdown.Item href="/myquizzes">My Quizzes</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={handleLogout}>
                                    <i className="bi bi-power" style={{fontSize: '16px', paddingRight: '10px'}}></i>

                                    {'Logout'}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>
                ) : (

                    <Button variant="outline-primary" href="/login">Log In</Button>
                )}
            </Container>
        </Navbar>
    );
}

export default Header;
