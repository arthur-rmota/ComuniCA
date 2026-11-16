
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Volume2,
  Pencil,
  ShieldAlert,
} from "lucide-react";
import { useNavigate } from "react-router";

import { getEmergencyPhrases } from "../../services/emergencyPhraseService";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import type { EmergencyPhrase } from "../../types/emergencyPhrase";
import { speak } from "../../utils/speech";

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
        console.error(
          "Erro ao carregar frases de emergência:",
          error,
        );

        if (active) {
          setError(
            "Não foi possível carregar as frases de emergência.",
          );
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
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE0D6]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-7 pt-3">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBE0D8]"
            >
              <ShieldAlert
                size={29}
                strokeWidth={2.4}
                color="#A52E24"
              />
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#42251D]">
              Emergência
            </h1>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold leading-relaxed text-[#592B1D]">
              Toque em uma mensagem e peça ajuda
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBE0D8]"
            >
              <Volume2
                size={23}
                strokeWidth={2.5}
                color="#A52E24"
              />
            </span>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-app-muted">
            Carregando mensagens de emergência...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        ) : phrases.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <AlertTriangle
              size={44}
              className="mx-auto mb-3 text-[#A52E24]"
              aria-hidden="true"
            />

            <p className="font-bold text-[#42251D]">
              Nenhuma mensagem disponível
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
              As mensagens de emergência aparecerão aqui
              quando forem cadastradas.
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
                  aria-label={`Falar: ${phrase.speechText}`}
                  className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 p-4 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                    isSpeaking
                      ? "border-[#A52E24] shadow-[0_5px_18px_rgba(165,46,36,0.18)]"
                      : "border-white/60 shadow-[0_5px_14px_rgba(41,37,36,0.07)]"
                  }`}
                  style={{
                    backgroundColor: "#F7C7BD",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/20"
                  />

                  <Icon
                    size={58}
                    strokeWidth={2.2}
                    color="#7C2D24"
                    aria-hidden="true"
                    className="relative"
                  />

                  <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                    {phrase.text}
                  </span>

                  {isSpeaking && (
                    <span
                      role="status"
                      className="relative flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-[#7C2D24]"
                    >
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#A52E24]" />
                      Falando...
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/emergencia/gerenciar")}
        aria-label="Gerenciar frases de emergência"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#F8E5D8] bg-white text-[#592B1D] shadow-lg transition-transform active:scale-95"
      >
        <Pencil
          size={24}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>
    </main>
  );
}

export default EmergencyPage;
