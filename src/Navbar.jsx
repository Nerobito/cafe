import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/Authcontext';

const CustomNavbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="success" variant="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">ReviewCafe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/cafe">Cafe</Nav.Link>
            <Nav.Link as={Link} to="/post">Post</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown title={user.username} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-light">Login</Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-light">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
