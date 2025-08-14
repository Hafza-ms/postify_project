import React from 'react';
import logo from '../assets/postify_standard_logo.jpg';
import { Navbar, Nav, NavDropdown, Container,Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBook } from "react-icons/fa";


function NavBar() {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const displayName = storedUser?.displayName || storedUser?.email || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3 py-2">
      <Container fluid>
        {/* Logo + Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
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
            <Nav.Link as={Link} to="/" className="text-white">
              Home
            </Nav.Link>
          </Nav>

          {storedUser && (
            <Nav className="ms-auto align-items-center">
              <NavDropdown
                title={
                  <span className="text-white d-flex align-items-center">
                    <FaUser className="me-2" /> {displayName}
                  </span>
                }
                id="user-dropdown"
                align="end"
                menuVariant="dark" // Ensures dark background for dropdown
              >
                <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                  <FaUser className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookmarked" className="d-flex align-items-center">
                  <FaBook className="me-2" /> Library
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center text-danger">
                  <FaSignOutAlt className="me-2" /> Logout
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
