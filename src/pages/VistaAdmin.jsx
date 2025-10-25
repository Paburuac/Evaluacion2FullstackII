// ---- VistaAdmin.jsx ----
import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Form } from 'react-bootstrap'

export default function VistaAdmin() {
  // --- Productos ---
  const [productos, setProductos] = useState([])
  const [usuarios, setUsuarios] = useState([])

  // --- Modal agregar usuario ---
  const [showUserModal, setShowUserModal] = useState(false)
  const [newUser, setNewUser] = useState({ nombre: '', apellido: '', email: '', password: '', rol: 'cliente' })

  // --- Modal agregar/editar producto ---
  const [showProductModal, setShowProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState({ id:'', nombre:'', categoria:'', precio:0, descripcion:'', imagen:'' })
  const [isNewProduct, setIsNewProduct] = useState(true) // Para saber si estamos creando o editando

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('tg_products')) || []
    setProductos(storedProducts)

    const storedUsers = JSON.parse(localStorage.getItem('tg_users')) || []
    setUsuarios(storedUsers)
  }, [])

  // --- Funciones productos ---
  const handleEliminarProducto = (id) => {
    const nuevos = productos.filter(p => p.id !== id)
    setProductos(nuevos)
    localStorage.setItem('tg_products', JSON.stringify(nuevos))
  }

  const handleEditarProducto = (producto) => {
    setEditProduct(producto)
    setIsNewProduct(false)
    setShowProductModal(true)
  }

  const handleAgregarProducto = () => {
    setEditProduct({ id: crypto.randomUUID(), nombre:'', categoria:'', precio:0, descripcion:'', imagen:'' })
    setIsNewProduct(true)
    setShowProductModal(true)
  }

  const handleGuardarProducto = () => {
    let nuevos
    if (isNewProduct) {
      nuevos = [...productos, editProduct]
    } else {
      nuevos = productos.map(p => p.id === editProduct.id ? editProduct : p)
    }
    setProductos(nuevos)
    localStorage.setItem('tg_products', JSON.stringify(nuevos))
    setShowProductModal(false)
  }

  // --- Funciones usuarios ---
  const handleEliminarUsuario = (id) => {
    const nuevos = usuarios.filter(u => u.id !== id)
    setUsuarios(nuevos)
    localStorage.setItem('tg_users', JSON.stringify(nuevos))
  }

  const handleAgregarUsuario = () => {
    const usuario = { ...newUser, id: crypto.randomUUID() }
    const nuevos = [...usuarios, usuario]
    setUsuarios(nuevos)
    localStorage.setItem('tg_users', JSON.stringify(nuevos))
    setNewUser({ nombre: '', apellido: '', email: '', password: '', rol: 'cliente' })
    setShowUserModal(false)
  }

  const rolColor = (rol) => {
    switch(rol){
      case 'cliente': return '#FFD966'
      case 'empleado': return '#9DD9F3'
      case 'administrador': return '#E06666'
      default: return 'transparent'
    }
  }

  return (
    <Container className="my-4">
      <h2 className="text-light text-center mb-4">Panel de Administración</h2>

      {/* --- Productos --- */}
      <h3 className="text-light mt-4">Productos</h3>
      <Button variant="success" className="mb-2" onClick={handleAgregarProducto}>Agregar Producto</Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio.toLocaleString('es-CL')}</td>
              <td>{p.descripcion}</td>
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
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarProducto(p)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminarProducto(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- Modal agregar/editar producto --- */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isNewProduct ? 'Agregar Producto' : 'Editar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={editProduct.nombre} onChange={e => setEditProduct({...editProduct, nombre:e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Control value={editProduct.categoria} onChange={e => setEditProduct({...editProduct, categoria:e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" value={editProduct.precio} onChange={e => setEditProduct({...editProduct, precio:parseInt(e.target.value)})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control value={editProduct.descripcion} onChange={e => setEditProduct({...editProduct, descripcion:e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Imagen</Form.Label>
              <Form.Control value={editProduct.imagen} onChange={e => setEditProduct({...editProduct, imagen:e.target.value})} />
            </Form.Group>
            <Button variant="primary" onClick={handleGuardarProducto}>{isNewProduct ? 'Agregar' : 'Guardar Cambios'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* --- Usuarios --- */}
      <h3 className="text-light mt-5">Usuarios</h3>
      <Button variant="success" className="mb-2" onClick={() => setShowUserModal(true)}>Agregar Usuario</Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>
                {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleEliminarUsuario(u.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* --- Modal agregar usuario --- */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={newUser.nombre} onChange={e => setNewUser({ ...newUser, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Apellido</Form.Label>
              <Form.Control value={newUser.apellido} onChange={e => setNewUser({ ...newUser, apellido: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={newUser.rol} onChange={e => setNewUser({ ...newUser, rol: e.target.value })}>
                <option value="cliente">Cliente</option>
                <option value="empleado">Empleado</option>
                <option value="administrador">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" onClick={handleAgregarUsuario}>Agregar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}
