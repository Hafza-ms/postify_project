import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import logo from '../assets/logo_postify.jpg';
import { signOut } from "firebase/auth";
import { auth } from "./RoutingPages/Firebase"

function NavBar() {
  const currentUser =JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();

 const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3 py-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex flex-column align-items-center">
          <img
            src={logo}
            alt="Postify Logo"
            width="40"
            height="40"
            className="rounded-circle me-2"
          />
          <span className="fw-bold text-light fs-5">Postify</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>

          {currentUser && (
            <Nav className="ms-auto align-items-center">
              <NavDropdown title={`👤 ${currentUser.displayName || currentUser.email}`} id="user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookmarked">Library</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
