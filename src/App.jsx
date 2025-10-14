import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './auth/AuthContext'
import AppNavbar from './components/AppNavbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Productos from './pages/Productos'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const [carrito, setCarrito] = useState([])

  // Cargar carrito guardado en localStorage al inicio
  useEffect(() => {
    const savedCart = localStorage.getItem('tg_cart')
    if (savedCart) setCarrito(JSON.parse(savedCart))
  }, [])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('tg_cart', JSON.stringify(carrito))
  }, [carrito])

  // Agrega productos, suma cantidad si ya existe
  const addToCart = (item, cantidad = 1) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === item.id)
      if (existe) {
        return prev.map(i =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      } else {
        return [...prev, { ...item, cantidad }]
      }
    })
  }

  // Remueve un producto por id
  const removeFromCart = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  // Disminuye la cantidad, elimina si llega a 0
  const decreaseQuantity = (id) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter(item => item.cantidad > 0)
    )
  }

  // Vacía el carrito
  const clearCart = () => {
    setCarrito([])
  }

  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos onAdd={addToCart} />} />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Carrito
                  items={carrito}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  onDecreaseQuantity={decreaseQuantity}
                  onClear={clearCart}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
