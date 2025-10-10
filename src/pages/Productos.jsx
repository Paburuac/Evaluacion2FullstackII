import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const listaProductos = [
    { id: 1, name: 'Café LeBlanc Original', price: 2490, description: 'El blend especial de la casa, preparado con granos de café de tueste medio.', image: 'src/imagenes/imagen1.png' },
    { id: 2, name: 'Curry LeBlanc Original', price: 5990, description: 'El famoso curry casero con la receta secreta, servido con arroz japonés.', image: 'src/imagenes/imagen2.jpg' },
    { id: 3, name: 'Cheesecake Persona', price: 4990, description: 'Cheesecake de estilo japonés con base de galleta y topping de frutos rojos.', image: 'src/imagenes/imagen3.jpg' },
    { id: 4, name: 'Katsu Sando', price: 4990, description: 'Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.', image: 'src/imagenes/imagen4.jpg' },
    { id: 5, name: 'Desayuno Japonés', price: 3990, description: 'Set de desayuno tradicional con arroz, huevo, nori y sopa miso.', image: 'src/imagenes/imagen5.png' },
    { id: 6, name: '"Joker\'s Wild" Cocktail', price: 3490, description: 'Cóctel sin alcohol con jugo de granada, ginger ale y un toque de lima.', image: 'src/imagenes/imagen6.png' }
];

// Componente que maneja la tarjeta individual y su contador
const ProductoCard = ({ p, onAdd }) => {
    // ESTADO: La cantidad de este producto (inicia en 1)
    const [cantidad, setCantidad] = useState(1);

    const handleDecrease = () => {
        // Asegura que la cantidad mínima sea 1
        setCantidad(prev => Math.max(1, prev - 1));
    };

    const handleIncrease = () => {
        setCantidad(prev => prev + 1);
    };

    const handleAddToCart = () => {
        // Llama a la función del carrito con el producto y la cantidad
        onAdd(p, cantidad);
        // Opcional: Reiniciar el contador a 1 después de agregar
        setCantidad(1);
    };

    // Aplicamos la clase card-shadow que definiste en tu CSS para el efecto hover
    return (
        <Card bg="dark" text="light" className="card-shadow">
            <Card.Img
                variant="top"
                src={p.image}
                alt={p.name}
                style={{ height: '220px', objectFit: 'cover' }}
            />
            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <Card.Title>{p.name}</Card.Title>

                    <Card.Text className="text-light" style={{ minHeight: '60px', fontSize: '0.9em' }}>
                        {p.description}
                    </Card.Text>

                    <Card.Text className="text-light" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        Precio: ${p.price.toLocaleString('es-CL')}
                    </Card.Text>
                </div>

                {/* Controles de Cantidad */}
                <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        {/* Botón de Restar: Usamos el estilo outline-light para un look limpio */}
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={handleDecrease}
                            // Usamos el color de acento para el texto si es outline
                            style={{ marginRight: '2px', width: '30px', fontWeight: 'bold' }}
                            className="btn"
                        >
                            -
                        </Button>
                        <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>
                            {cantidad}
                        </span>
                        {/* Botón de Sumar */}
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={handleIncrease}
                            style={{ marginLeft: '2px', width: '30px', fontWeight: 'bold' }}
                            className="btn"
                        >
                            +
                        </Button>
                    </div>

                    {/* Botón de Agregar: Usamos tu clase personalizada para el color de café */}
                    <Button
                        className='btn-primary-cafe'
                        onClick={handleAddToCart}
                        style={{ width: '100%' }}
                    >
                        Agregar {cantidad} al carrito
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
// ----------------------------------------------------


// Componente principal de la página de productos
export default function Productos({ onAdd }) {
    return (
        <Container>
            <h2 className="page-title text-light text-center">Productos</h2>
            <Row >
                {listaProductos.map(p => (
                    <Col md={4} key={p.id} className="mb-4 ">
                        {/* Renderiza la tarjeta con el contador */}
                        <ProductoCard p={p} onAdd={onAdd} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}