import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VistaAdmin from "./pages/VistaAdmin";
import VistaStaff from "./pages/VistaStaff";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Home siempre visible, aunque haya sesión */}
          <Route path="/" element={<Home />} />

          <Route path="/productos" element={<Productos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/vistaAdmin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <VistaAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vistaStaff"
            element={
              <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                <VistaStaff />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
