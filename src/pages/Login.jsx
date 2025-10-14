import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login">  {/* Agregado: Clase "login" para estilos específicos */}
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="p-3 bg-dark text-light">  {/* Actualizado: Agregado bg-dark y text-light para el tema */}
                        <Card.Body>
                            <Card.Title className="mb-3">Iniciar sesión</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}  {/* Puedes estilizar Alert en CSS si es necesario */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control value={username} onChange={e => setUsername(e.target.value)} placeholder="tu_usuario" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button type="submit" className="btn-primary-cafe" disabled={loading}>  {/* Actualizado: Cambiado a className="btn-primary-cafe" */}
                                        {loading ? 'Ingresando…' : 'Ingresar'}
                                    </Button>
                                </div>
                            </Form>
                            <hr />
                            <p className="mb-0">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}