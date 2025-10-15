import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth, BRAND_COLOR } from "../auth/AuthContext";

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 Si ya hay sesión abierta, redirige según rol
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "ADMIN") navigate("/vistaAdmin", { replace: true });
    else if (currentUser.role === "STAFF") navigate("/vistaStaff", { replace: true });
    else navigate("/", { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({
        username: form.username.trim(),
        password: form.password.trim(),
      });
      if (user.role === "ADMIN") navigate("/vistaAdmin", { replace: true });
      else if (user.role === "STAFF") navigate("/vistaStaff", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100" style={{ maxWidth: 400 }}>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h3 className="text-center mb-4" style={{ color: BRAND_COLOR, fontWeight: "bold" }}>
                Iniciar sesión
              </h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
