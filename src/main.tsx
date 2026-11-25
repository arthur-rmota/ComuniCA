import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { seedDatabase } from "./database/seed";
import { loadNeuralSpeech } from "./services/neuralSpeechService";
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

    // Carrega o modelo de voz sem bloquear a aplicação.
    void loadNeuralSpeech()
      .then(() => {
        console.info("Modelo de voz neural carregado.");
      })
      .catch((error) => {
        console.warn(
          "Não foi possível carregar o modelo de voz neural:",
          error,
        );
      });
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
}

void initializeApp();
