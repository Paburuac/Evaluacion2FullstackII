import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'


const listaProductos = [
    { id: 1, name: 'Café LeBlanc Original', price: 2490, description: 'El blend especial de la casa, preparado con granos de café de tueste medio.', image: 'src/imagenes/imagen1.png' },
    { id: 2, name: 'Curry LeBlanc Original', price: 5990, description: 'El famoso curry casero con la receta secreta, servido con arroz japonés.', image: 'src/imagenes/imagen2.jpg' },
    { id: 3, name: 'Cheesecake Persona', price: 4990, description: 'Cheesecake de estilo japonés con base de galleta y topping de frutos rojos.', image: 'src/imagenes/imagen3.jpg' },
    { id: 4, name: 'Katsu Sando', price: 4990, description: 'Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.', image: 'src/imagenes/imagen4.jpg' },
    { id: 5, name: 'Desayuno Japonés', price: 3990, description: 'Set de desayuno tradicional con arroz, huevo, nori y sopa miso.', image: 'src/imagenes/imagen5.png' },
    { id: 6, name: '"Joker\'s Wild" Cocktail', price: 3490, description: 'Cóctel sin alcohol con jugo de granada, ginger ale y un toque de lima.', image: 'src/imagenes/imagen6.png' }
]

export default function Productos({ onAdd }) {
    return (
        <Container>
            <h2 className="page-title">Productos</h2>
            <Row >
                {listaProductos.map(p => (
                    <Col md={4} key={p.id} className="mb-4">
                        <Card bg="dark" text="light">
                            {/* 1. Se añade la imagen del producto */}
                            <Card.Img 
                                variant="top" 
                                src={p.image} 
                                alt={p.name}
                                // Estilos opcionales para mejor visualización
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                {/* 2. Corregido: Se usa p.name para el título */}
                                <Card.Title>{p.name}</Card.Title>
                                
                                {/* 3. Se añade la descripción del producto */}
                                <Card.Text className="primary">
                                    {p.description}
                                </Card.Text>
                                
                                {/* 4. Corregido: Se usa p.price para el precio y se pone en negrita */}
                                <Card.Text className="text-light">
                                    Precio: ${p.price.toLocaleString('es-CL')}
                                </Card.Text>
                                <Button  
                                    onClick={() => onAdd(p)}
                                    variant="secondary" // Opcional: Define un color para el botón
                                >
                                    Agregar al carrito
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}