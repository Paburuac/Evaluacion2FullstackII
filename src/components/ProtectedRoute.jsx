import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()

  // Si no está logueado, redirigir a login
  if (!user) return <Navigate to="/login" replace />

  // Si se especifica rol y no coincide, redirigir a home
  if (role && user.rol !== role) return <Navigate to="/" replace />

  return children
}
