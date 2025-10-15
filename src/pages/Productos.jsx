import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

export default function Productos() {
  const { listProducts } = useAuth();
  const products = listProducts(); // se cargan los productos reales del admin

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4" style={{ color: '#744f36' }}>
        Nuestros Productos
      </h2>

      <Row className="g-4">
        {products.length > 0 ? (
          products.map((p) => (
            <Col md={4} key={p.id}>
              <Card className="h-100 shadow-sm">
                {p.image && (
                  <Card.Img
                    variant="top"
                    src={p.image}
                    alt={p.nombre}
                    style={{
                      height: '250px',
                      objectFit: 'cover',
                      background: '#f8f8f8',
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{p.nombre}</Card.Title>
                  <Card.Text>{p.description || '—'}</Card.Text>
                  <strong style={{ color: '#744f36' }}>
                    ${Number(p.precio || 0).toLocaleString('es-CL')}
                  </strong>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted text-center">
              No hay productos disponibles por ahora.
            </p>
          </Col>
        )}
      </Row>
    </Container>
  );
}
