import React from 'react'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function AppNavbar() {
  const { user, logout } = useAuth()

  const isAdmin = user?.rol === 'administrador'

  return (
    <Navbar
      bg={isAdmin ? "dark" : "light"}
      variant={isAdmin ? "dark" : "light"}
      expand="md"
      className={`mb-4 ${isAdmin ? "navbar-dark-admin" : "navbar-cream"}`}
    >
      <Container>
        <Navbar.Brand as={Link} to={isAdmin ? "/admin" : "/"}>
          {isAdmin ? "Panel Admin" : "Cafe LeBlanc"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          {/* Sección izquierda */}
          <Nav className="me-auto">
            {isAdmin ? (
              <>
                <Nav.Link as={NavLink} to="/admin">Gestión de Usuarios</Nav.Link>
                <Nav.Link as={NavLink} to="/productos">Productos (Opcional)</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
                <Nav.Link as={NavLink} to="/carrito">Carrito</Nav.Link>
                <Nav.Link as={NavLink} to="/contacto">Contáctanos</Nav.Link>
              </>
            )}
          </Nav>

          {/* Sección derecha */}
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Hola, <strong>{user.nombre}</strong>{isAdmin && " (Admin)"}
                </Navbar.Text>
                <Button
                  size="sm"
                  variant={isAdmin ? "outline-light" : "outline-dark"}
                  onClick={logout}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
            