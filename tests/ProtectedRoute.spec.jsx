import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../src/components/ProtectedRoute.jsx";

describe("ProtectedRoute Component", () => {

    // Test 1: verifica que se muestre el mensaje de acceso denegado para usuarios no autenticados
    it("debería renderizar el mensaje de acceso denegado para usuarios no autenticados", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        expect(
            screen.getByText(/Acceso denegado. Por favor, inicia sesión para continuar./i)
        ).toBeInTheDocument();
    });

    // Test 2: verifica que se muestre el contenido protegido para usuarios autenticados
    it("debería renderizar el contenido protegido para usuarios autenticados", () => {
        render(
            <MemoryRouter>
                <Footer isAuthenticated={true}>
                    <div>Contenido Protegido</div>
                </Footer>
            </MemoryRouter>
        );
        expect(screen.getByText("Contenido Protegido")).toBeInTheDocument();
    });

});