import React, { useState } from 'react'
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap'

const listaProductos = [
  { id: 1, nombre: 'Café LeBlanc Original', precio: 2490, categoria: 'Bebidas', descripcion: 'El blend especial de la casa, preparado con granos de café de tueste medio.', imagen: '/imagenes/imagen1.png' },
  { id: 2, nombre: 'Curry LeBlanc Original', precio: 5990, categoria: 'Comidas', descripcion: 'El famoso curry casero con la receta secreta, servido con arroz japonés.', imagen: '/imagenes/imagen2.png' },
  { id: 3, nombre: 'Cheesecake Persona', precio: 4990, categoria: 'Postres', descripcion: 'Cheesecake de estilo japonés con base de galleta y topping de frutos rojos.', imagen: '/imagenes/imagen3.png' },
  { id: 4, nombre: 'Katsu Sando', precio: 4990, categoria: 'Comidas', descripcion: 'Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.', imagen: '/imagenes/imagen4.png' },
  { id: 5, nombre: 'Desayuno Japonés', precio: 3990, categoria: 'Comidas', descripcion: 'Set de desayuno tradicional con arroz, huevo, nori y sopa miso.', imagen: '/imagenes/imagen5.png' },
  { id: 6, nombre: '"Joker\'s Wild" Cocktail', precio: 3490, categoria: 'Bebidas', descripcion: 'Cóctel sin alcohol con jugo de granada, ginger ale y un toque de lima.', imagen: '/imagenes/imagen6.png' }
]

const categorias = [...new Set(listaProductos.map(p => p.categoria))]

function ProductoCard({ producto, onAdd }) {
  const [cantidad, setCantidad] = useState(1)
  const [src, setSrc] = useState(producto.imagen) // Ruta inicial desde la lista

  // Si falla la carga de .png cambia a .jpg
  const handleError = () => {
    if (src.endsWith('.png')) {
      setSrc(src.replace('.png', '.jpg'))
    }
  }

  const aumentar = () => setCantidad(c => c + 1)
  const disminuir = () => setCantidad(c => (c > 1 ? c - 1 : 1))

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
            onClick={() => { onAdd(producto, cantidad); setCantidad(1) }}
          >
            Agregar
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default function Productos({ onAdd }) {
  return (
    <Container className="my-4">
      <h2 className="page-title text-light text-center mb-4">Productos</h2>
      {categorias.map(categoria => (
        <section key={categoria} className="mb-5">
          <h3 className="text-light mb-3">{categoria}</h3>
          <Row>
            {listaProductos.filter(p => p.categoria === categoria).map(producto => (
              <Col key={producto.id} md={4} className="mb-4">
                <ProductoCard producto={producto} onAdd={onAdd} />
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </Container>
  )
}
