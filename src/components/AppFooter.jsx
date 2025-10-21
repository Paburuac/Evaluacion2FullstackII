import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AppFooter() {
    // Definición simple de enlaces para el footer
    const enlacesCuenta = [
        { path: "/perfil/ordenes", name: "Mis Pedidos" },
        { path: "/login", name: "Iniciar Sesión" },
        { path: "/register", name: "Registrarse" }
    ];

    const enlacesInfo = [
        { path: "/contacto", name: "Contacto y Ubicación" },
        { path: "/terminos", name: "Términos y Condiciones" },
        { path: "/privacidad", name: "Política de Privacidad" }
    ];

    return (
        // Utilizamos un div con clases que hacen referencia a tu tema oscuro
        <div className="app-footer mt-5 pt-4 pb-2">
            <Container>
                <Row>
                    {/* Sección Marca y Copyright */}
                    <Col md={4} className="mb-4">
                        <h5 style={{ color: 'var(--color-crema)', fontWeight: 'bold' }}>Café Le Blanc</h5>
                        <p className="muted" style={{ fontSize: '0.9rem' }}>
                            Un rincón de acogida en el corazón de Santiago.
                        </p>
                        <p className="muted" style={{ fontSize: '0.8rem' }}>
                            © {new Date().getFullYear()} Café Le Blanc. Todos los derechos reservados.
                        </p>
                    </Col>

                    {/* Sección Enlaces de Cuenta */}
                    <Col md={4} className="mb-4">
                        <h5 style={{ color: 'var(--color-crema)' }}>Mi Cuenta</h5>
                        <ul className="list-unstyled">
                            {enlacesCuenta.map(link => (
                                <li key={link.path} className="mb-2">
                                    <Link to={link.path} className="text-decoration-none" style={{ color: 'var(--color-acento)' }}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>

                    {/* Sección Información Legal/Tienda */}
                    <Col md={4} className="mb-4">
                        <h5 style={{ color: 'var(--color-crema)' }}>Información</h5>
                        <ul className="list-unstyled">
                            {enlacesInfo.map(link => (
                                <li key={link.path} className="mb-2">
                                    <Link to={link.path} className="text-decoration-none" style={{ color: 'var(--color-acento)' }}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center pt-3 border-top" style={{ borderColor: 'var(--color-acento)' }}>
                        <p className="muted" style={{ fontSize: '0.75rem' }}>
                            Proyecto React de Fullstack II - Pablo Astudillo & Sebastián Gutierrez
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}