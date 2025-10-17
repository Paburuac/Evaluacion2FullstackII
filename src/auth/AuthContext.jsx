import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const USERS_KEY = 'tg_users' // lista de usuarios registrados
const SESSION_KEY = 'tg_session' // usuario logueado actual

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)

    // Cargar sesión persistida
    useEffect(() => {
        const raw = localStorage.getItem(SESSION_KEY)
        if(raw){ setUser(JSON.parse(raw)) }
    }, [])

    const getUsers = () => {
        const raw = localStorage.getItem(USERS_KEY)
        return raw ? JSON.parse(raw) : []
    }

    const saveUsers = (list) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(list))
    }

    const register = ({ nombre, apellido, email, password }) => {
        // Validación de campos antes de intentar usar toLowerCase()
        if (!nombre || !apellido || !email || !password) {
            throw new Error('Faltan campos obligatorios para el registro.');
        }

        const users = getUsers()
        
        // Usamos el email para verificar que no exista (ahora de forma segura)
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase()) 
        
        if(exists){ throw new Error('El correo electrónico ya está en uso.') }
        
        // Guardamos todos los campos, incluyendo 'email'
        const newUser = { id: crypto.randomUUID(), nombre, apellido, email, password }
        users.push(newUser)
        saveUsers(users)
        
        return { id: newUser.id, nombre, apellido, email }
    }


    const login = ({ email, password }) => {
        const users = getUsers()
        // Buscamos por email y password
        const match = users.find(u => u.email === email && u.password === password)
        if(!match){ throw new Error('Correo electrónico o contraseña inválidos.') }

        // Guardamos la sesión con el campo EMAIL explícito
        const sessionUser = { 
            id: match.id, 
            nombre: match.nombre, 
            apellido: match.apellido, 
            email: match.email, // CLAVE
        }

        setUser(sessionUser)
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
        return sessionUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem(SESSION_KEY)
    }

    const value = { user, register, login, logout }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}