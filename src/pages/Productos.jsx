import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para navegación
import { useAuth } from '../auth/AuthContext'; // Importar el contexto de autenticación

function ProductoCard({ producto, onAdd }) {
  const [cantidad, setCantidad] = useState(1);
  const [src, setSrc] = useState(producto.imagen); // Ruta inicial desde la lista
  const navigate = useNavigate(); // Hook para navegación
  const { user } = useAuth(); // Obtener el usuario del contexto

  // Si falla la carga de .png cambia a .jpg
  const handleError = () => {
    if (src.endsWith('.png')) {
      setSrc(src.replace('.png', '.jpg'));
    }
  };

  const aumentar = () => setCantidad(c => c + 1);
  const disminuir = () => setCantidad(c => (c > 1 ? c - 1 : 1));

  // Función para manejar el click en "Agregar"
  const handleAdd = () => {
    if (!user) { // Verificar si el usuario no está logueado usando el contexto
      navigate('/login');
    } else {
      onAdd(producto, cantidad);
      setCantidad(1);
      window.alert(`Producto "${producto.nombre}" ha sido agregado al carrito`);
    }
  };

  return (
    <Card bg="dark" text="light" className="card-shadow h-100">
      <Card.Img
        variant="top"
        src={src}
        alt={producto.nombre}
        onError={handleError}
        style={{ height: 220, objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text style={{ flexGrow: 1, fontSize: '0.9em' }}>{producto.descripcion}</Card.Text>
        <Card.Text className="fw-bold">Precio: ${producto.precio.toLocaleString('es-CL')}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <ButtonGroup size="sm">
            <Button variant="outline-light" onClick={disminuir}>-</Button>
            <Button variant="light" disabled>{cantidad}</Button>
            <Button variant="outline-light" onClick={aumentar}>+</Button>
          </ButtonGroup>
          <Button
            className="btn-primary-cafe"
            onClick={handleAdd} // Usar la nueva función handleAdd
          >
            Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function Productos({ onAdd }) {
  const [productos, setProductos] = useState([]);

  // Cargar productos desde localStorage al montar
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('tg_products')) || [];
    setProductos(storedProducts);
  }, []);

  // Obtener categorías dinámicamente
  const categorias = [...new Set(productos.map(p => p.categoria))];

  return (
    <Container className="my-4">
      <h2 className="page-title text-light text-center mb-4">Productos</h2>
      {categorias.map(categoria => (
        <section key={categoria} className="mb-5">
          <h3 className="text-light mb-3">{categoria}</h3>
          <Row>
            {productos.filter(p => p.categoria === categoria).map(producto => (
              <Col key={producto.id} md={3} className="mb-4">
                <ProductoCard producto={producto} onAdd={onAdd} />
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </Container>
  );
}
