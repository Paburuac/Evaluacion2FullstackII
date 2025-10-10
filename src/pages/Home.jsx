import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';

export default function Home(){
return (
<main>
    {/*
    Adaptando la sección principal (hero) de index.html
    Usamos un div como contenedor principal para aplicar las clases de hero-section
    y Container/Row/Col de React Bootstrap para el layout
    */}
    <div id="home" className="hero-section">
        <Container>
            <Row className="hero-content">
                <Col md={12}>
                    <h1>Café Le Blanc</h1>
                    <p>Un acogedor café temático inspirado en la estética y el ambiente del icónico establecimiento de Persona 5, ubicado en el corazón de Santiago.</p>
                    <p>Fomentamos la comunidad y la conexión entre personas que comparten la pasión por la cultura japonesa, el café de especialidad y los videojuegos.</p>
                    {/* El botón se reemplaza por el componente Button de React Bootstrap */}
                    <Button 
                        className="hero-button" 
                        variant="primary" // Usamos una variante de Bootstrap
                        onClick={() => window.location.href='productos.html'}
                    >
                        Conoce nuestros productos
                    </Button>
                </Col>
            </Row>
        </Container>
    </div>

    

    


</main>
)
}