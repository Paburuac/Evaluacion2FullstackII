import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'


const listaProductos = [
{ id: 1, nombre: 'Mouse Gamer', precio: 25000 },
{ id: 2, nombre: 'Teclado Mecánico', precio: 55000 },
{ id: 3, nombre: 'Auriculares RGB', precio: 35000 },
{ id: 4, nombre: 'Videojuego Elden Ring', precio: 45000 },
]


export default function Productos({ onAdd }){
return (
<Container>
<h2 className="page-title">Productos</h2>
<Row>
{listaProductos.map(p => (
<Col md={4} key={p.id} className="mb-3">
<Card>
<Card.Body>
<Card.Title>{p.nombre}</Card.Title>
<Card.Text className="muted">Precio: ${p.precio.toLocaleString('es-CL')}</Card.Text>
<Button onClick={() => onAdd(p)}>Agregar al carrito</Button>
</Card.Body>
</Card>
</Col>
))}
</Row>
</Container>
)
}