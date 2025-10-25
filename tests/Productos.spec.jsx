import { render, screen } from "@testing-library/react";
import Home from "../src/pages/Productos.jsx";

describe("Productos Component", () => {
    // Test 1: verifica que se muestre el título principal del componente Productos
    it("debería renderizar el título principal de Productos", () => {
        render(<Home />);
        expect(
            screen.getByRole("heading", { name: /Productos/i })
        ).toBeInTheDocument();
    });
});


