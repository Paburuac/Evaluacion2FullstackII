import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../src/components/AppFooter.jsx";

describe("AppFooter Component", () => {

    // Test 1: verifica que se muestre el texto de derechos reservados
    it("debería renderizar el texto de derechos reservados", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        expect(
            screen.getByText(/Café Le Blanc. Todos los derechos reservados./i)
        ).toBeInTheDocument();
    });

    // Test 2: verifica que los enlaces de "Mi Cuenta" estén presentes
    it("debería renderizar los enlaces de 'Mi Cuenta'", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        expect(screen.getByText("Mis Pedidos")).toBeInTheDocument();
        expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
        expect(screen.getByText("Registrarse")).toBeInTheDocument();
    });
    // Test 3: verifica que los enlaces de "Información" estén presentes
    it("debería renderizar los enlaces de 'Información'", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        expect(screen.getByText("Contacto y Ubicación")).toBeInTheDocument();
        expect(screen.getByText("Términos y Condiciones")).toBeInTheDocument();
        expect(screen.getByText("Política de Privacidad")).toBeInTheDocument();
    });

});