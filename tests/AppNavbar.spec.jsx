import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppNavbar from '../src/components/AppNavbar.jsx'
import { useAuth } from '../src/auth/AuthContext'

describe('AppNavbar Componente ', () => {
    // Test 1: verifica que se rendericen los enlaces correctos según el estado de autenticación
    it('debería renderizar enlaces para usuario no autenticado', () => {
        useAuth.mockReturnValue({ user: null })
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        )
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
        expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })
    // Test 2: verifica que se rendericen los enlaces correctos para usuario autenticado estándar
    it('debería renderizar enlaces para usuario autenticado estándar', () => {
        useAuth.mockReturnValue({ user: { nombre: 'Juan', rol: 'usuario' }, logout: jest.fn() })
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        )
        expect(screen.getByText('Productos')).toBeInTheDocument()
        expect(screen.getByText('Carrito')).toBeInTheDocument()
        expect(screen.getByText('Contáctanos')).toBeInTheDocument()
        expect(screen.getByText('Hola, Juan')).toBeInTheDocument()
    })
    // Test 3: verifica que se rendericen los enlaces correctos para usuario administrador
    it('debería renderizar enlaces para usuario administrador', () => {
        useAuth.mockReturnValue({ user: { nombre: 'Admin', rol: 'administrador' }, logout: jest.fn() })
        render(
            <MemoryRouter>
                <AppNavbar />
            </MemoryRouter>
        )
        expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument()
        expect(screen.getByText('Productos (Opcional)')).toBeInTheDocument()
        expect(screen.getByText('Hola, Admin (Admin)')).toBeInTheDocument()
    })

})
