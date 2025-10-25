// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
