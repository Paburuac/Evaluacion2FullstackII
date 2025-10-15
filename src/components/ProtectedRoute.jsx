import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Uso:
 * <ProtectedRoute roles={["ADMIN"]}><VistaAdmin /></ProtectedRoute>
 */
export default function ProtectedRoute({ roles = [], children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    // Si el rol no coincide, mándalo a su panel o al home
    if (currentUser.role === "ADMIN") return <Navigate to="/vistaAdmin" replace />;
    if (currentUser.role === "STAFF") return <Navigate to="/vistaStaff" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}
