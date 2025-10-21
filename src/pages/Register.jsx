import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

export default function Register() {
    const { register, login } = useAuth()
    const navigate = useNavigate()
    
    // Formulario
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            // Registrar con rol predeterminado "cliente"
            await register(form)
            // Iniciar sesión automáticamente
            await login({ email: form.email, password: form.password })
            navigate('/')
        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado al registrarse.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={7} lg={6}>
                    <Card className="p-4 p-lg-5 login card-shadow bg-dark text-light">
                        <Card.Body>
                            <Card.Title className="page-title text-center mb-4">
                                Únete al Café LeBlanc ☕
                            </Card.Title>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                name="nombre"
                                                value={form.nombre}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Apellido</Form.Label>
                                            <Form.Control
                                                name="apellido"
                                                value={form.apellido}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={onChange}
                                        placeholder="ejemplo@phantom-thieves.com"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button
                                        type="submit"
                                        className="btn-primary-cafe"
                                        disabled={loading}
                                    >
                                        {loading ? 'Iniciando conexión…' : '¡Crear cuenta y entrar!'}
                                    </Button>
                                </div>
                            </Form>

                            <hr className="mt-4 mb-3" />
                            <p className="mb-0 text-center text-light">
                                ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none">Inicia sesión aquí</Link>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
