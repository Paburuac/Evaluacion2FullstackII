// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const USERS_KEY = 'tg_users' // lista de usuarios registrados
const SESSION_KEY = 'tg_session' // usuario logueado actual

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    // 🔸 Cargar sesión persistida
    useEffect(() => {
        const raw = localStorage.getItem(SESSION_KEY)
        if (raw) setUser(JSON.parse(raw))
    }, [])

    // 🔸 Asegurar que exista el admin inicial
    useEffect(() => {
        const users = getUsers()
        const adminExists = users.some(u => u.rol === 'administrador')

        if (!adminExists) {
            const defaultAdmin = {
                id: crypto.randomUUID(),
                nombre: 'Admin',
                apellido: 'Principal',
                email: 'admin@leblanc.cl',
                password: 'admin123',
                rol: 'administrador'
            }
            users.push(defaultAdmin)
            saveUsers(users)
            console.log('✅ Usuario administrador creado: admin@leblanc.cl / admin123')
        }
    }, [])

    // --- Funciones auxiliares ---
    const getUsers = () => {
        const raw = localStorage.getItem(USERS_KEY)
        return raw ? JSON.parse(raw) : []
    }

    const saveUsers = (list) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(list))
    }

    // --- Registro (solo clientes) ---
    const register = ({ nombre, apellido, email, password }) => {
        if (!nombre || !apellido || !email || !password) {
            throw new Error('Faltan campos obligatorios para el registro.')
        }

        const users = getUsers()
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
        if (exists) throw new Error('El correo electrónico ya está en uso.')

        const newUser = {
            id: crypto.randomUUID(),
            nombre,
            apellido,
            email,
            password,
            rol: 'cliente' // 🔹 Todos los registros normales son clientes
        }

        users.push(newUser)
        saveUsers(users)
        return { id: newUser.id, nombre, apellido, email, rol: newUser.rol }
    }

    // --- Inicio de sesión ---
    const login = ({ email, password }) => {
        const users = getUsers()
        const match = users.find(u => u.email === email && u.password === password)
        if (!match) throw new Error('Correo electrónico o contraseña inválidos.')

        const sessionUser = {
            id: match.id,
            nombre: match.nombre,
            apellido: match.apellido,
            email: match.email,
            rol: match.rol
        }

        setUser(sessionUser)
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
        return sessionUser
    }

    // --- Cerrar sesión ---
    const logout = () => {
        setUser(null)
        localStorage.removeItem(SESSION_KEY)
    }

    // --- Exportar funciones ---
    const value = { user, register, login, logout, getUsers, saveUsers }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
