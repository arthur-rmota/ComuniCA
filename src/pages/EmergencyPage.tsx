import { useEffect, useState } from "react";
import { AlertTriangle, Volume2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Pencil } from "lucide-react";
import { getEmergencyPhrases } from "../services/emergencyPhraseService";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";
import type { EmergencyPhrase } from "../types/emergencyPhrase";
import { speak } from "../utils/speech";

function EmergencyPage() {
  const navigate = useNavigate();
  const [phrases, setPhrases] = useState<EmergencyPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPhrases() {
      try {
        const data = await getEmergencyPhrases();

        if (active) {
          setPhrases(data);
          setError("");
        }
      } catch (error) {
        console.error("Erro ao carregar frases de emergência:", error);

        if (active) {
          setError("Não foi possível carregar as frases de emergência.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPhrases();

    return () => {
      active = false;
    };
  }, []);

  function handleSpeak(phrase: EmergencyPhrase) {
    setSpeakingId(null);

    speak(
      phrase.speechText,
      () => setSpeakingId(phrase.id),
      () =>
        setSpeakingId((currentId) =>
          currentId === phrase.id ? null : currentId,
        ),
    );
  }

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-3">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-app-text">
          Emergência
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Toque em uma mensagem para pedir ajuda
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
          >
            <Volume2 size={20} />
          </span>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-app-muted">
          Carregando mensagens de emergência...
        </p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : phrases.length === 0 ? (
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm text-app-muted">
            Nenhuma frase de emergência cadastrada.
          </p>
        </div>
      ) : (
        <section
          aria-label="Frases de emergência"
          className="grid grid-cols-2 gap-3"
        >
          {phrases.map((phrase) => {
            const selectedIcon = quickPhraseIcons.find(
              (item) => item.id === phrase.icon,
            );

            const Icon = selectedIcon?.Icon ?? AlertTriangle;
            const isSpeaking = speakingId === phrase.id;

            return (
              <button
                key={phrase.id}
                type="button"
                onClick={() => handleSpeak(phrase)}
                aria-label={`Falar: ${phrase.text}`}
                className={`flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-[#F4C7AB] p-4 text-center transition-transform active:scale-[0.98] ${
                  isSpeaking
                    ? "border-brand-primary shadow-md"
                    : "border-transparent"
                }`}
              >
                <Icon
                  size={52}
                  strokeWidth={2.5}
                  color="#7C2D12"
                  aria-hidden="true"
                />

                <span className="break-words text-sm font-semibold text-app-text">
                  {phrase.text}
                </span>

                {isSpeaking && (
                  <span
                    role="status"
                    className="flex items-center gap-1 text-xs font-medium text-[#7C2D12]"
                  >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
                    Falando...
                  </span>
                )}
              </button>
            );
          })}
        </section>
      )}
      <button
        type="button"
        onClick={() => navigate("/emergencia/gerenciar")}
        aria-label="Gerenciar frases de emergência"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-app-text shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}

export default EmergencyPage;
