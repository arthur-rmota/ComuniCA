
import { useEffect, useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";
import { useNavigate } from "react-router";

import AppIcon from "../../components/common/AppIcon";
import { getEmergencyPhrases } from "../../services/emergencyPhraseService";
import type { EmergencyPhrase } from "../../types/emergencyPhrase";
import { speak } from "../../utils/speech";

const emergencyPictograms: Record<string, string> = {
  "life-buoy": "Ajuda",
  "phone-call": "Phone",
};

function EmergencyPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<EmergencyPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState("");

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
    setSpeechError("");
    setSpeakingId(null);

    speak(
      phrase.speechText,
      () => {
        setSpeakingId(phrase.id);
      },
      () => {
        setSpeakingId((currentId) =>
          currentId === phrase.id ? null : currentId,
        );
      },
      {
        volume: 1,
        onError: () => {
          setSpeechError(
            "Não foi possível reproduzir a mensagem. Verifique o áudio do aparelho e tente novamente.",
          );
        },
      },
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
              <AppIcon name="ShieldAlert" size={44} />
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
              <AppIcon name="Volume2" size={40} />
            </span>
          </div>
        </header>

        {speechError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-[#F4D4BD] bg-[#FFF0E4] p-4"
          >
            <AlertTriangle
              size={22}
              className="mt-0.5 shrink-0 text-[#A52E24]"
              aria-hidden="true"
            />

            <p className="text-sm font-semibold leading-6 text-[#9A3412]">
              {speechError}
            </p>
          </div>
        )}

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
            <AppIcon
              name="AlertTriangle"
              size={64}
              className="mx-auto mb-3"
            />

            <p className="font-bold text-[#42251D]">
              Nenhuma mensagem disponível
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
              As mensagens de emergência aparecerão aqui quando forem
              cadastradas.
            </p>
          </div>
        ) : (
          <section
            aria-label="Frases de emergência"
            className="grid grid-cols-2 gap-3"
          >
            {phrases.map((phrase) => {
              const isSpeaking = speakingId === phrase.id;

              const iconName =
                emergencyPictograms[phrase.icon] ?? phrase.icon;

              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => handleSpeak(phrase)}
                  aria-label={`Falar: ${phrase.speechText}`}
                  className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 p-2 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
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

                  <AppIcon
                    name={iconName || "AlertTriangle"}
                    size={128}
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
        <Pencil size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </main>
  );
}

export default EmergencyPage;
