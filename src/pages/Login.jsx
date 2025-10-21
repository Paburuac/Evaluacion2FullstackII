import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const user = await login({ email, password })
            
            // Redirigir según rol
            if (user.rol === 'administrador') {
                navigate('/admin')
            }else if (user.rol === 'empleado') {
                navigate('/empleado')
            }
            
            else {
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="login my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="p-3 bg-dark text-light card-shadow">
                        <Card.Body>
                            <Card.Title className="mb-3 text-center">Iniciar sesión</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="ejemplo@phantom-thieves.com"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button type="submit" className="btn-primary-cafe" disabled={loading}>
                                        {loading ? 'Ingresando…' : 'Ingresar'}
                                    </Button>
                                </div>
                            </Form>
                            <hr />
                            <p className="mb-0 text-center">
                                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
