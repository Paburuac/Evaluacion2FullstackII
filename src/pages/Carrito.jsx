import React, { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';

export default function Carrito({ items, onRemove, onDecreaseQuantity, onAdd, onClear }) {
  // Estado para controlar las rutas de imagenes con fallback
  const [srcMap, setSrcMap] = useState({});

  // Maneja error para cambiar la extensión png -> jpg
  const handleError = (id) => {
    setSrcMap(prev => {
      const currentSrc = prev[id] || `/imagenes/imagen${id}.png`;
      if (currentSrc.endsWith('.png')) {
        return { ...prev, [id]: currentSrc.replace('.png', '.jpg') };
      }
      return prev;
    });
  };

  // Agrupar productos por categoría
  const productosPorCategoria = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.categoria]) acc[item.categoria] = [];
      acc[item.categoria].push(item);
      return acc;
    }, {});
  }, [items]);

  // Total suma precio * cantidad
  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }, [items]);

  if (items.length === 0)
    return (
      <Container className="my-4 carrito">
        <h2 className="page-title text-light">Carrito</h2>
        <p className="text-light">Tu carrito está vacío.</p>
      </Container>
    );

  return (
    <Container className="my-4 carrito">
      <h2 className="page-title text-light mb-4">Carrito de Compras</h2>

      {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
        <section key={categoria} className="mb-4">
          <h4 className="text-light">{categoria}</h4>
          <Row>
            {productos.map((item) => {
              const imgSrc = srcMap[item.id] || `/imagenes/imagen${item.id}.png`;

              return (
                <Col md={6} lg={4} key={item.id} className="mb-3">
                  <Card bg="dark" text="light" className="h-100">
                    <Card.Img
                      variant="top"
                      src={imgSrc}
                      alt={item.nombre}
                      onError={() => handleError(item.id)}
                      style={{ height: 150, objectFit: 'cover' }}  // Actualizado: Cambiado de 220 a 150 para reducir el tamaño
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.nombre}</Card.Title>
                      <Card.Text style={{ flexGrow: 1 }}>
                        Precio unitario: ${item.precio.toLocaleString('es-CL')}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <ButtonGroup size="sm">
                          <Button
                            variant="outline-light"
                            onClick={() => onDecreaseQuantity(item.id)}
                            disabled={item.cantidad === 1}
                          >
                            -
                          </Button>
                          <Button variant="light" disabled>{item.cantidad}</Button>
                          <Button variant="outline-light" onClick={() => onAdd(item, 1)}>+</Button>
                        </ButtonGroup>
                        <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>Eliminar</Button>
                      </div>

                      <Card.Text className="fw-bold">
                        Subtotal: ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      ))}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4 className="text-light">Total: ${total.toLocaleString('es-CL')}</h4>
        <Button variant="danger" onClick={onClear}>
          Vaciar carrito
        </Button>
        <Button className="btn-primary-cafe">
          Finalizar compra
        </Button>
      </div>
    </Container>
  );
}
