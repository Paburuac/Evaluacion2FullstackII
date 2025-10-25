import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, BRAND_COLOR } from "../auth/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // vuelve al home
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: BRAND_COLOR }}
      variant="dark"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Café LeBlanc
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/productos">
              Productos
            </Nav.Link>
          </Nav>

          {!currentUser ? (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Iniciar sesión
              </Nav.Link>
              <Button
                as={Link}
                to="/register"
                size="sm"
                style={{
                  backgroundColor: "#ffffff",
                  color: BRAND_COLOR,
                  borderColor: "#ffffff",
                  marginLeft: 8,
                }}
              >
                Registrarse
              </Button>
            </Nav>
          ) : (
            <Nav className="ms-auto align-items-center">
              {/* Enlace visible solo para ADMIN */}
              {currentUser.role === "ADMIN" && (
                <Nav.Link as={Link} to="/vistaAdmin">
                  Admin
                </Nav.Link>
              )}

              {/* Enlace visible solo para STAFF */}
              {currentUser.role === "STAFF" && (
                <Nav.Link as={Link} to="/vistaStaff">
                  Staff
                </Nav.Link>
              )}

              <NavDropdown title={`Hola, ${currentUser.username}`} align="end">
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
