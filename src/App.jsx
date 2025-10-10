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


export default function App(){
const [carrito, setCarrito] = useState([])


// Persistir carrito opcionalmente
useEffect(() => {
const raw = localStorage.getItem('tg_cart')
if(raw){ setCarrito(JSON.parse(raw)) }
}, [])


useEffect(() => {
localStorage.setItem('tg_cart', JSON.stringify(carrito))
}, [carrito])


const addToCart = (item) => setCarrito(prev => [...prev, item])
const removeFromCart = (index) => setCarrito(prev => prev.filter((_, i) => i !== index))
const clearCart = () => setCarrito([])


return (
<AuthProvider>
<Router>
<AppNavbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/productos" element={<Productos onAdd={addToCart} />} />
<Route path="/carrito" element={
<ProtectedRoute>
<Carrito items={carrito} onRemove={removeFromCart} onClear={clearCart} />
</ProtectedRoute>
} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
</Routes>
</Router>
</AuthProvider>
)
}