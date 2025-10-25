import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../src/pages/Home.jsx";

describe("Home Component", () => {

    // Test 1: verifica que se muestre el título principal del Home ("Café Le Blanc")
    it("debería renderizar el título principal", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("heading", { name: /Café Le Blanc/i })
        ).toBeInTheDocument();
    });

    // Test 2: comprueba que aparezca el botón del hero que lleva al menú de productos
    it("debería renderizar el botón para ir al menú", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("button", { name: /Conoce nuestro Menú/i })
        ).toBeInTheDocument();
    });

    // Test 3: verifica que exista la sección de “Imprescindibles del Mes”
    // (el título del carrusel de productos destacados)
    it("debería renderizar la sección de productos destacados", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("heading", { name: /Imprescindibles del Mes/i })
        ).toBeInTheDocument();
    });

    // Test 4: se asegura de que el carrusel realmente tenga productos dentro (imágenes)
    it("debería renderizar las tarjetas de productos del carrusel", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        const productImages = screen.getAllByRole("img");
        expect(productImages.length).toBeGreaterThan(0);
    });

    // Test 5: revisa que esté el botón "Ver Menú Completo" al final del carrusel
    it("debería tener un botón para ver el menú completo", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("button", { name: /Ver Menú Completo/i })
        ).toBeInTheDocument();
    });

    // Test 6: verifica que exista el botón de contacto en la última sección ("Contáctanos")
    it("debería tener un botón para contacto", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByRole("button", { name: /Contáctanos/i })
        ).toBeInTheDocument();
    });
});
