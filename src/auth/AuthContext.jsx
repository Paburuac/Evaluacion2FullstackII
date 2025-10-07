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


const register = ({ nombre, apellido, username, password }) => {
const users = getUsers()
const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase())
if(exists){ throw new Error('El nombre de usuario ya está en uso.') }
const newUser = { id: crypto.randomUUID(), nombre, apellido, username, password }
users.push(newUser)
saveUsers(users)
return { id: newUser.id, nombre, apellido, username }
}


const login = ({ username, password }) => {
const users = getUsers()
const match = users.find(u => u.username === username && u.password === password)
if(!match){ throw new Error('Usuario o contraseña inválidos.') }
const sessionUser = { id: match.id, nombre: match.nombre, apellido: match.apellido, username: match.username }
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