import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 

export default function Contacto() {
    // Obtenemos el usuario actual
    const { user } = useAuth(); 
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log("Simulando envío de mensaje...");
        
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <main>
            <Container className="my-5 contact-container">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <h1 className="page-title text-center mb-5">
                            Contáctanos
                        </h1>

                        <Card className="card-shadow contact-card">
                            <Card.Body className="p-4 p-md-5">
                                
                                {submitted ? (
                                    <Alert variant="success" className="text-center alert-success-animated">
                                        <h4>Mensaje enviado correctamente 😄☕</h4>
                                        <p className="mb-0">Gracias por contactarnos, te responderemos a la brevedad.</p>
                                        <Link to="/">
                                            <Button variant="outline-success" className="mt-3">Volver a la Página Principal</Button>
                                        </Link>
                                    </Alert>
                                ) : (
                                    <>
                                        <h2 className="text-center mb-4 muted">¿Tienes alguna pregunta, sugerencia o quieres cotizar un evento?</h2>
                                
                                        <Form className="mt-4" onSubmit={handleSubmit}>
                                            <Row>
                                                {!user ? (
                                                    // Usuario NO logeado: Se piden Nombre y Correo
                                                    <>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group controlId="formNombre">
                                                                <Form.Label>Nombre Completo</Form.Label>
                                                                <Form.Control type="text" placeholder="Ingresa tu nombre" required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6} className="mb-3">
                                                            <Form.Group controlId="formEmail">
                                                                <Form.Label>Correo Electrónico</Form.Label>
                                                                <Form.Control type="email" placeholder="ejemplo@correo.com" required />
                                                            </Form.Group>
                                                        </Col>
                                                    </>
                                                ) : (
                                                    // Usuario logeado: Mostramos bienvenida y usamos user.email
                                                    <Col md={12} className="mb-4">
                                                        <Alert variant="info" className="text-center">
                                                            **¡Hola, {user.nombre}!** Tu mensaje será enviado desde **{user.email}**.
                                                        </Alert>
                                                        {/* Campos ocultos usan user.email */}
                                                        <input type="hidden" name="nombre" value={user.nombre} />
                                                        <input type="hidden" name="email" value={user.email} /> 
                                                    </Col>
                                                )}
                                            </Row>

                                            {/* Campo de selección para Asunto */}
                                            <Form.Group controlId="formAsunto" className="mb-3">
                                                <Form.Label>Asunto de la Consulta</Form.Label>
                                                <Form.Select required>
                                                    <option value="">Selecciona un asunto...</option>
                                                    <option value="reserva">Reserva de Mesas o Eventos</option>
                                                    <option value="sugerencia">Sugerencia o Feedback</option>
                                                    <option value="producto">Consulta sobre un Producto/Menú</option>
                                                    <option value="trabajo">Oferta de Empleo / Práctica</option>
                                                    <option value="otro">Otro (Especificar en el mensaje)</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group controlId="formMensaje" className="mb-4">
                                                <Form.Label>Mensaje</Form.Label>
                                                <Form.Control as="textarea" rows={4} placeholder="Escribe tu mensaje aquí..." required />
                                            </Form.Group>

                                            <div className="d-grid gap-2">
                                                <Button 
                                                    variant="primary" 
                                                    type="submit" 
                                                    className="btn-primary-cafe"
                                                >
                                                    Enviar Mensaje
                                                </Button>
                                            </div>
                                        </Form>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                {/* Sección Visítanos (Temática LeBlanc) */}
                <Row className="mt-5 text-center">
                    <Col md={12}>
                        <h2 className="page-title mb-4 muted">Visítanos en nuestro "Escondite"</h2> 
                    </Col>
                    
                    <Col md={6} className="mb-4">
                        <Card className="info-card h-100 p-3">
                            <Card.Body>
                                <Card.Title className="text-dark">Dirección</Card.Title>
                                <Card.Text className="text-muted">
                                    **Pasaje Tenderini #331**, Santiago Centro, Chile.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6} className="mb-4">
                        <Card className="info-card h-100 p-3">
                            <Card.Body>
                                <Card.Title className="text-dark">Horario</Card.Title>
                                <Card.Text className="text-muted">
                                    Lunes a Sábado: 10:00 a 20:00 hrs.
                                    <br/>
                                    Domingos y Feriados: Cerrado.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Contenedor del Mapa (Santiago Centro - Lastarria) */}
                <Row className="mt-4">
                    <Col md={12}>
                        <div className="map-placeholder">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13316.632230501867!2d-70.65171728271732!3d-33.4385901321458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a085d77051%3A0xc6c4f51e0ccf3e80!2sPasaje%20Tenderini%20331%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1660852084555!5m2!1ses-419!2scl" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '16px' }}
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación del Café Le Blanc en Pasaje Tenderini"
                            ></iframe>
                        </div>
                    </Col>
                </Row>
            </Container>
        </main>
    )
}