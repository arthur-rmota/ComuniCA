
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { seedDatabase } from "./database/seed";
import "./index.css";
import App from "./App.js";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root não encontrado no HTML.");
}

async function initializeApp() {
  try {
    await seedDatabase();

    createRoot(rootElement!).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
  } catch (error) {
    console.error(
      "Erro ao inicializar o banco de dados:",
      error,
    );
  }
}

void initializeApp();
