import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'


export default function Home(){
return (
<Container>
<Row className="mb-4">
<Col>
<h1 className="page-title">Bienvenido a Tienda Gamer</h1>
<p className="muted">Videojuegos y artículos de computación con atención profesional.</p>
</Col>
</Row>
<Row>
<Col md={4} className="mb-3">
<Card>
<Card.Body>
<Card.Title>Periféricos</Card.Title>
<Card.Text>Mouse, teclados y auriculares para un setup profesional.</Card.Text>
</Card.Body>
</Card>
</Col>
<Col md={4} className="mb-3">
<Card>
<Card.Body>
<Card.Title>Hardware</Card.Title>
<Card.Text>Componentes para potenciar tu PC gamer.</Card.Text>
</Card.Body>
</Card>
</Col>
<Col md={4} className="mb-3">
<Card>
<Card.Body>
<Card.Title>Videojuegos</Card.Title>
<Card.Text>Títulos destacados y lanzamientos recientes.</Card.Text>
</Card.Body>
</Card>
</Col>
</Row>
</Container>
)
}