import React, { useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Button, Table, Form, Alert
} from "react-bootstrap";
import { useAuth, BRAND_COLOR } from "../auth/AuthContext";

export default function VistaStaff() {
  const {
    listProducts,
    updateProduct,
    recordSale,
    listIngredients,
    orderMoreIngredient,
    logout,
  } = useAuth();

  const [flash, setFlash] = useState("");
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);
  const toast = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  };

  const products = useMemo(() => listProducts(), [listProducts, version]);
  const ingredients = useMemo(() => listIngredients(), [listIngredients, version]);

  const [venta, setVenta] = useState({
    productId: "",
    qty: 1,
    pago: "Efectivo",
  });

  const handleStockChange = (id, diff) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    updateProduct(id, { stock: Math.max(0, (p.stock || 0) + diff) });
    bump();
  };

  const handleVenta = (e) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === venta.productId);
    if (!prod) return;
    const amount = prod.precio * venta.qty;
    recordSale({
      productId: prod.id,
      qty: venta.qty,
      amount,
      pago: venta.pago,
    });
    updateProduct(prod.id, { stock: Math.max(0, prod.stock - venta.qty) });
    bump();
    toast(`Venta registrada: ${prod.nombre}`);
    setVenta({ productId: "", qty: 1, pago: "Efectivo" });
  };

  const handleOrderIngredient = (id) => {
    orderMoreIngredient(id, 10);
    bump();
    toast("Ingrediente encargado (+10)");
  };

  return (
    <div style={{ backgroundColor: BRAND_COLOR, minHeight: "100vh", paddingTop: 24, paddingBottom: 48 }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-white mb-1">Panel del Personal</h2>
            <p className="text-white-50">Control de stock y ventas</p>
          </Col>
          <Col className="text-end">
            <Button variant="light" onClick={logout}>Cerrar sesión</Button>
          </Col>
        </Row>

        {flash && <Alert variant="success">{flash}</Alert>}

        {/* === PRODUCTOS === */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: BRAND_COLOR, color: "white" }}>
            Productos en venta
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.nombre}
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                            background: "#eee",
                          }}
                        />
                      )}
                    </td>
                    <td>{p.nombre}</td>
                    <td style={{ maxWidth: 300 }}>{p.description}</td>
                    <td>${Number(p.precio).toLocaleString("es-CL")}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => handleStockChange(p.id, +1)}
                        >
                          +1
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => handleStockChange(p.id, -1)}
                        >
                          -1
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* === REGISTRAR VENTA === */}
        <Card className="mb-4">
          <Card.Header style={{ backgroundColor: BRAND_COLOR, color: "white" }}>
            Registrar venta
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleVenta}>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Select
                    value={venta.productId}
                    onChange={(e) => setVenta({ ...venta, productId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    min="1"
                    value={venta.qty}
                    onChange={(e) => setVenta({ ...venta, qty: Number(e.target.value) })}
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={venta.pago}
                    onChange={(e) => setVenta({ ...venta, pago: e.target.value })}
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </Form.Select>
                </Col>
                <Col md="auto" className="ms-auto">
                  <Button
                    type="submit"
                    style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}
                  >
                    Registrar venta
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* === INGREDIENTES === */}
        <Card>
          <Card.Header style={{ backgroundColor: BRAND_COLOR, color: "white" }}>
            Stock de cocina
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Stock actual</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nombre}</td>
                    <td>{i.stock}</td>
                    <td>
                      <Button
                        size="sm"
                        style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}
                        onClick={() => handleOrderIngredient(i.id)}
                      >
                        Encargar más
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
