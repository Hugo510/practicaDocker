import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("debe renderizar el titulo principal", () => {
    render(<App />);
    expect(screen.getByText(/React \+ Docker Lab/i)).toBeInTheDocument();
  });

  it("debe mostrar la seccion de variables de entorno", () => {
    render(<App />);
    expect(screen.getByText(/Variables de Entorno/i)).toBeInTheDocument();
  });

  it("debe mostrar el boton contador", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /count is/i })
    ).toBeInTheDocument();
  });

  it("debe mostrar las variables de entorno por defecto", () => {
    render(<App />);
    expect(screen.getByText(/Runtime API URL:/i)).toBeInTheDocument();
    expect(screen.getByText(/Build-time VITE_API_URL:/i)).toBeInTheDocument();
  });
});
