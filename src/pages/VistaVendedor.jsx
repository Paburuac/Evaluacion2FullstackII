// ---- VistaVendedor.jsx ----
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Row, Col } from 'react-bootstrap';

export default function VistaVendedor() {
  // --- Productos y ventas ---
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('tg_products')) || [];
    setProductos(storedProducts);

    const storedSales = JSON.parse(localStorage.getItem('tg_sales')) || [];
    setVentas(storedSales);
  }, []);

  // --- Registrar venta ---
  const handleVenderProducto = (producto) => {
    const nuevaVenta = {
      id: crypto.randomUUID(),
      productId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      createdAt: Date.now()
    };
    const nuevasVentas = [nuevaVenta, ...ventas];
    setVentas(nuevasVentas);
    localStorage.setItem('tg_sales', JSON.stringify(nuevasVentas));
    setFlash(`Venta registrada: ${producto.nombre}`);
    setTimeout(() => setFlash(""), 2000);
  };

  // --- Totales ---
  const totalVentas = ventas.reduce((acc, v) => acc + (v.precio * v.cantidad), 0);
  const totalProductosVendidos = ventas.reduce((acc, v) => acc + v.cantidad, 0);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-light">Panel de Vendedor</h2>

      {flash && <Alert variant="success">{flash}</Alert>}

      {/* Productos */}
      <h4 className="text-light mb-2">Productos disponibles</h4>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                  onError={(e) => {
                    if (p.imagen.endsWith('.png')) e.currentTarget.src = p.imagen.replace('.png', '.jpg')
                  }}
                />
              </td>
              <td>{p.nombre}</td>
              <td>${p.precio.toLocaleString('es-CL')}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => handleVenderProducto(p)}>Vender</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Resumen de ventas */}
      <h4 className="text-light mt-4">Resumen de ventas</h4>
      <Row className="mb-3">
        <Col>Total productos vendidos: <strong>{totalProductosVendidos}</strong></Col>
        <Col>Total ventas: <strong>${totalVentas.toLocaleString('es-CL')}</strong></Col>
      </Row>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
              <td>{v.nombre}</td>
              <td>{v.cantidad}</td>
              <td>${(v.precio * v.cantidad).toLocaleString('es-CL')}</td>
            </tr>
          ))}
          {ventas.length === 0 && (
            <tr><td colSpan={4} className="text-center text-muted">No hay ventas registradas</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
