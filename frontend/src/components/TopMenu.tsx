import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { PathNames } from '../router/PathNames';

const TopMenu: React.FC = () => {
    const { role, logOut } = useUserContext();

    return (
        <Navbar bg="light" variant="light" expand="lg" className="mb-4">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to={PathNames.authenticated.products}>
                        Products
                    </Nav.Link>
                    {role === 'WORKER' && (
                        <>
                            <Nav.Link as={Link} to={PathNames.authenticated.orders}>
                                Orders
                            </Nav.Link>
                        </>
                    )}
                    {role === 'CLIENT' && (
                        <>
                            <Nav.Link as={Link} to={PathNames.authenticated.orders}>
                                My Orders
                            </Nav.Link>
                            <Nav.Link as={Link} to={PathNames.client.cart}>
                                Cart
                            </Nav.Link>
                        </>
                    )}
                </Nav>
                <Button variant="outline-light" className="m-1" onClick={logOut}>
                    Log Out
                </Button>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TopMenu;
