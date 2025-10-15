import React, { useMemo, useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Table,
  Tabs, Tab, Alert, InputGroup, Badge, Accordion
} from "react-bootstrap";
import { useAuth, BRAND_COLOR } from "../auth/AuthContext";

export default function VistaAdmin() {
  const {
    // productos
    listProducts, listRemovedProducts, addProduct, updateProduct, removeProduct, restoreProduct, resetProductsToSeed,
    // usuarios
    listUsers, register, updateUser, removeUser,
    // ventas
    listSales, recordSale, getMonthlySummary,
    // auth
    logout
  } = useAuth();

  const [active, setActive] = useState("productos");
  const [flash, setFlash] = useState("");
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);
  const toast = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2000); };

  // ======== Productos (activos y retirados) ========
  const products = useMemo(() => listProducts(), [listProducts, version]);
  const removed = useMemo(() => listRemovedProducts(), [listRemovedProducts, version]);
  const productsById = useMemo(() => {
    const map = new Map();
    [...products, ...removed].forEach(p => map.set(p.id, p));
    return map;
  }, [products, removed]);

  const [prodForm, setProdForm] = useState({
    nombre: "", precio: "", stock: "", description: "", image: ""
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    addProduct({
      nombre: prodForm.nombre.trim(),
      precio: Number(prodForm.precio || 0),
      stock: Number(prodForm.stock || 0),
      description: prodForm.description?.trim() || "",
      image: prodForm.image?.trim() || ""
    });
    setProdForm({ nombre: "", precio: "", stock: "", description: "", image: "" });
    bump(); toast("Producto agregado");
  };

  const handleQuickUpdate = (id, patch) => { updateProduct(id, patch); bump(); };
  const handleRemoveProduct = (id) => {
    if (confirm("¿Retirar este producto? Quedará en 'Productos retirados'.")) {
      removeProduct(id);
      bump(); toast("Producto retirado");
    }
  };
  const handleRestoreProduct = (id) => {
    restoreProduct(id);
    bump(); toast("Producto restaurado");
  };

  const handleResetCatalog = () => {
    if (confirm("Esto restablecerá el catálogo a su estado base y quitará cambios en productos (altas/bajas/ediciones). ¿Continuar?")) {
      resetProductsToSeed();
      bump();
      toast("Catálogo restablecido a su estado base");
    }
  };

  // ======== Usuarios ========
  const users = useMemo(() => listUsers(), [listUsers, version]);
  const [userForm, setUserForm] = useState({
    nombre: "", apellido: "", username: "", password: "", role: "USER"
  });
  const handleAddUser = async (e) => {
    e.preventDefault();
    await register(userForm);
    setUserForm({ nombre: "", apellido: "", username: "", password: "", role: "USER" });
    bump(); toast("Usuario creado");
  };
  const handleRemoveUser = (id) => {
    try { removeUser(id); bump(); toast("Usuario eliminado"); }
    catch (e) { alert(e.message); }
  };

  // ======== Ventas / Resumen ========
  const sales = useMemo(() => listSales(), [listSales, version]);
  const handleAddSale = (productId) => {
    const p = productsById.get(productId);
    if (!p || p.isDeleted) return;
    recordSale({ productId, qty: 1, amount: Number(p.precio || 0) });
    bump(); toast("Venta registrada");
  };

  // ---- Resumen por días (últimos 30 días)
  const since = useMemo(() => Date.now() - 30 * 24 * 60 * 60 * 1000, []);
  const last30 = useMemo(
    () => sales.filter(s => s.createdAt >= since),
    [sales, since]
  );

  // formatea "15 de septiembre 2025" (sin el "de" antes del año)
  const formatFriendlyDate = (ts) => {
    const d = new Date(ts);
    const str = d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
    return str.replace(/ de (\d{4})$/, " $1");
  };

  // clave yyyy-mm-dd local
  const dateKey = (ts) => {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Agrupar ventas por día y dentro del día por producto
  const dailyGroups = useMemo(() => {
    const byDay = new Map();
    for (const s of last30) {
      const key = dateKey(s.createdAt);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(s);
    }
    // convertir a arreglo ordenado desc por fecha
    const days = Array.from(byDay.entries()).map(([key, items]) => {
      // totales del día
      let totalQty = 0;
      let totalAmount = 0;

      // agrupar por producto
      const byProduct = new Map();
      for (const it of items) {
        const entry = byProduct.get(it.productId) || { qty: 0, amount: 0 };
        entry.qty += (it.qty || 0);
        entry.amount += (it.amount || 0);
        byProduct.set(it.productId, entry);
        totalQty += (it.qty || 0);
        totalAmount += (it.amount || 0);
      }

      // detalle por producto (orden por monto desc)
      const details = Array.from(byProduct.entries()).map(([pid, vals]) => {
        const p = productsById.get(pid);
        const unit = vals.qty ? Math.round(vals.amount / vals.qty) : 0; // promedio ponderado
        return {
          productId: pid,
          nombre: p?.nombre || "(eliminado)",
          qty: vals.qty,
          unitPrice: unit,
          total: vals.amount
        };
      }).sort((a, b) => b.total - a.total);

      // timestamp del día (usar la 1ra venta para mostrar fecha)
      const dayTs = items[0]?.createdAt || Date.now();

      return {
        key,
        dateTs: dayTs,
        dateLabel: formatFriendlyDate(dayTs),
        totalQty,
        totalAmount,
        details
      };
    });

    // ordenar por día desc
    days.sort((a, b) => b.dateTs - a.dateTs);
    return days;
  }, [last30, productsById]);

  // Totales del período
  const monthlyTotals = useMemo(() => {
    return dailyGroups.reduce(
      (acc, d) => {
        acc.unidades += d.totalQty;
        acc.monto += d.totalAmount;
        return acc;
      },
      { unidades: 0, monto: 0 }
    );
  }, [dailyGroups]);

  // para cards de "desde", ventas, monto (seguimos usando helper)
  const resumenBase = useMemo(() => getMonthlySummary(), [getMonthlySummary, version]);

  // ======== Estilo de tabs activos (texto negro) ========
  const tabTitle = (key, label) => (
    <span style={{ color: active === key ? "black" : "white", fontWeight: active === key ? 600 : "normal" }}>
      {label}
    </span>
  );

  return (
    <div style={{ backgroundColor: BRAND_COLOR, minHeight: "100vh", paddingTop: 24, paddingBottom: 48 }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-white mb-1">Panel de Administración</h2>
            <p className="text-white-50">Gestión de productos, usuarios y ventas</p>
          </Col>
          <Col className="text-end">
            <Button variant="light" onClick={logout}>Cerrar sesión</Button>
          </Col>
        </Row>

        {flash && <Alert variant="success">{flash}</Alert>}

        <Card>
          <Card.Header style={{ backgroundColor: BRAND_COLOR }}>
            <Tabs id="admin-tabs" activeKey={active} onSelect={(k) => setActive(k || "productos")} className="mb-0" style={{ borderBottom: "none" }}>
              {/* ===================== PRODUCTOS ===================== */}
              <Tab eventKey="productos" title={tabTitle("productos", "Productos")}>
                <Card.Body>
                  <h5 className="mb-3">Agregar producto</h5>
                  <Form onSubmit={handleAddProduct} className="mb-4">
                    <Row className="g-2">
                      <Col md={4}>
                        <Form.Control placeholder="Nombre" value={prodForm.nombre} onChange={(e) => setProdForm({ ...prodForm, nombre: e.target.value })} required />
                      </Col>
                      <Col md={2}>
                        <InputGroup>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control placeholder="Precio" type="number" step="0.01" value={prodForm.precio} onChange={(e) => setProdForm({ ...prodForm, precio: e.target.value })} required />
                        </InputGroup>
                      </Col>
                      <Col md={2}>
                        <Form.Control placeholder="Stock" type="number" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} required />
                      </Col>
                      <Col md={4}>
                        <Form.Control placeholder='URL de imagen (ej: "src/imagenes/imagen1.png")' value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} />
                      </Col>
                      <Col md={12}>
                        <Form.Control as="textarea" rows={2} placeholder="Descripción" value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} />
                      </Col>
                      <Col md="auto" className="ms-auto">
                        <Button type="submit" style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}>
                          Agregar
                        </Button>
                      </Col>
                    </Row>
                  </Form>

                  <h5 className="mb-3">Listado de productos</h5>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th style={{ width: 120 }}>Precio</th>
                        <th style={{ width: 120 }}>Stock</th>
                        <th style={{ width: 200 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.image ? (<img src={p.image} alt={p.nombre} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, background: "#eee" }} />) : (<span className="text-muted">—</span>)}</td>
                          <td>{p.nombre}</td>
                          <td style={{ maxWidth: 320 }}>{p.description || <span className="text-muted">—</span>}</td>
                          <td>
                            ${Number(p.precio ?? 0).toLocaleString("es-CL")}
                            <div className="d-flex gap-2 mt-2">
                              <Button size="sm" variant="outline-primary" onClick={() => handleQuickUpdate(p.id, { precio: Number(p.precio || 0) + 500 })}>+$500</Button>
                              <Button size="sm" variant="outline-primary" onClick={() => handleQuickUpdate(p.id, { precio: Math.max(0, Number(p.precio || 0) - 500) })}>-$500</Button>
                            </div>
                          </td>
                          <td>
                            {Number(p.stock ?? 0)}
                            <div className="d-flex gap-2 mt-2">
                              <Button size="sm" variant="outline-secondary" onClick={() => handleQuickUpdate(p.id, { stock: Number(p.stock || 0) + 1 })}>+1</Button>
                              <Button size="sm" variant="outline-secondary" onClick={() => handleQuickUpdate(p.id, { stock: Math.max(0, Number(p.stock || 0) - 1) })}>-1</Button>
                            </div>
                          </td>
                          <td>
                            <Button size="sm" variant="outline-danger" onClick={() => handleRemoveProduct(p.id)}>Retirar</Button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted">Sin productos activos</td></tr>
                      )}
                    </tbody>
                  </Table>

                  {/* ---------- Productos retirados ---------- */}
                  <h5 className="mt-4 mb-3">Productos retirados</h5>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th style={{ width: 120 }}>Precio</th>
                        <th style={{ width: 120 }}>Stock</th>
                        <th style={{ width: 160 }}>Retirado</th>
                        <th style={{ width: 120 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {removed.map((p) => (
                        <tr key={p.id}>
                          <td>{p.image ? (<img src={p.image} alt={p.nombre} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, background: "#eee" }} />) : (<span className="text-muted">—</span>)}</td>
                          <td>{p.nombre}</td>
                          <td style={{ maxWidth: 320 }}>{p.description || <span className="text-muted">—</span>}</td>
                          <td>${Number(p.precio ?? 0).toLocaleString("es-CL")}</td>
                          <td>{Number(p.stock ?? 0)}</td>
                          <td>{p.removedAt ? new Date(p.removedAt).toLocaleString() : "—"}</td>
                          <td>
                            <Button size="sm" style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }} onClick={() => handleRestoreProduct(p.id)}>
                              Restaurar
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {removed.length === 0 && (
                        <tr><td colSpan={7} className="text-center text-muted">No hay productos retirados</td></tr>
                      )}
                    </tbody>
                  </Table>

                  {/* ---------- Reset catálogo base ---------- */}
                  <Card className="mt-4">
                    <Card.Body>
                      <h5 className="mb-2">Restablecer catálogo base</h5>
                      <p className="text-muted mb-3">
                        Vuelve a cargar los productos originales (por ejemplo, si retiraste o editaste varios y quieres partir de cero).
                      </p>
                      <Button onClick={handleResetCatalog} style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}>
                        Restablecer catálogo base
                      </Button>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Tab>

              {/* ===================== USUARIOS ===================== */}
              <Tab eventKey="usuarios" title={tabTitle("usuarios", "Usuarios")}>
                <Card.Body>
                  <h5>Crear usuario</h5>
                  <Form onSubmit={handleAddUser} className="mb-4">
                    <Row className="g-2">
                      <Col md={3}><Form.Control placeholder="Nombre" value={userForm.nombre} onChange={(e)=>setUserForm({...userForm, nombre:e.target.value})} required /></Col>
                      <Col md={3}><Form.Control placeholder="Apellido" value={userForm.apellido} onChange={(e)=>setUserForm({...userForm, apellido:e.target.value})} required /></Col>
                      <Col md={3}><Form.Control placeholder="Usuario" value={userForm.username} onChange={(e)=>setUserForm({...userForm, username:e.target.value})} required /></Col>
                      <Col md={3}><Form.Control type="password" placeholder="Contraseña" value={userForm.password} onChange={(e)=>setUserForm({...userForm, password:e.target.value})} required /></Col>
                      <Col md={3}>
                        <Form.Select value={userForm.role} onChange={(e)=>setUserForm({...userForm, role:e.target.value})}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                        </Form.Select>
                      </Col>
                      <Col md="auto" className="ms-auto">
                        <Button type="submit" style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}>Crear</Button>
                      </Col>
                    </Row>
                  </Form>

                  <Table hover responsive>
                    <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.username}</td>
                          <td>{u.nombre} {u.apellido}</td>
                          <td><Badge bg={u.role === "ADMIN" ? "danger" : "secondary"}>{u.role}</Badge></td>
                          <td className="d-flex gap-2">
                            <Button size="sm" variant="outline-primary" onClick={() => { updateUser(u.id, { role: u.role === "ADMIN" ? "USER" : "ADMIN" }); bump(); }}>Toggle rol</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleRemoveUser(u.id)}>Eliminar</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Tab>

              {/* ===================== ÚLTIMAS VENTAS ===================== */}
              <Tab eventKey="ventas" title={tabTitle("ventas", "Últimas ventas")}>
                <Card.Body>
                  <p className="text-muted">Registra ventas rápidas haciendo clic en un producto activo.</p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {products.map((p) => (
                      <Button key={p.id} onClick={() => handleAddSale(p.id)} style={{ backgroundColor: BRAND_COLOR, borderColor: BRAND_COLOR }}>
                        Vender: {p.nombre} (${Number(p.precio).toFixed(0)})
                      </Button>
                    ))}
                    {products.length === 0 && <span className="text-muted">Agrega productos primero.</span>}
                  </div>

                  <Table hover responsive>
                    <thead><tr><th>Fecha</th><th>Producto</th><th>Cantidad</th><th>Monto</th></tr></thead>
                    <tbody>
                      {sales.slice(0, 20).map((s) => {
                        const p = productsById.get(s.productId);
                        return (
                          <tr key={s.id}>
                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                            <td>{p?.nombre || "(eliminado)"}</td>
                            <td>{s.qty}</td>
                            <td>${Number(s.amount).toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Tab>

              {/* ===================== RESUMEN (30 DÍAS) — POR DÍA ===================== */}
              <Tab eventKey="resumen" title={tabTitle("resumen", "Resumen (30 días)")}>
                <Card.Body>
                  <h5 className="mb-3">Ventas por día (últimos 30 días)</h5>

                  {dailyGroups.length === 0 ? (
                    <p className="text-muted">Sin ventas en el período.</p>
                  ) : (
                    <Accordion alwaysOpen>
                      {dailyGroups.map((d, idx) => (
                        <Accordion.Item eventKey={String(idx)} key={d.key} className="mb-2">
                          <Accordion.Header>
                            <div className="w-100 d-flex justify-content-between align-items-center">
                              <strong>{d.dateLabel}</strong>
                              <div className="d-flex gap-4">
                                <span><strong>Productos vendidos:</strong> {d.totalQty}</span>
                                <span><strong>Total día:</strong> ${Number(d.totalAmount).toLocaleString("es-CL")}</span>
                                <span className="text-decoration-underline">Ver detalle</span>
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <Table responsive hover className="mb-0">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th style={{ width: 140 }}>Cantidad</th>
                                  <th style={{ width: 160 }}>Precio c/u</th>
                                  <th style={{ width: 160 }}>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {d.details.map((it) => (
                                  <tr key={it.productId}>
                                    <td>{it.nombre}</td>
                                    <td>{it.qty}</td>
                                    <td>${Number(it.unitPrice).toLocaleString("es-CL")}</td>
                                    <td>${Number(it.total).toLocaleString("es-CL")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  )}

                  {/* Totales del período */}
                  <Card className="mt-4">
                    <Card.Body className="d-flex flex-wrap gap-4">
                      <div>
                        <div className="text-muted">Desde</div>
                        <div className="h5 mb-0">{resumenBase.desde.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-muted">Productos vendidos</div>
                        <div className="h5 mb-0">{monthlyTotals.unidades}</div>
                      </div>
                      <div>
                        <div className="text-muted">Monto total</div>
                        <div className="h5 mb-0">${monthlyTotals.monto.toLocaleString("es-CL")}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Tab>
            </Tabs>
          </Card.Header>
        </Card>
      </Container>
    </div>
  );
}
