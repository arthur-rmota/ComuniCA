
import { recordHistory } from "../services/historyService";

let lastSpokenText: string | null = null;

type SpeechOptions = {
  volume?: number;
  onError?: () => void;
};

export function speak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  options?: SpeechOptions,
): void {
  const cleanText = text.trim();

  if (!cleanText) {
    options?.onError?.();
    onEnd?.();
    return;
  }

  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    console.error("Síntese de voz não suportada neste navegador.");
    options?.onError?.();
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    lastSpokenText = cleanText;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    if (options?.volume !== undefined) {
      utterance.volume = Math.max(0, Math.min(1, options.volume));
    }

    utterance.onstart = () => {
      recordHistory(cleanText).catch((error) => {
        console.error(
          "Erro ao registrar histórico de reprodução:",
          error,
        );
      });

      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (event) => {
      if (
        event.error !== "interrupted" &&
        event.error !== "canceled"
      ) {
        console.error("Erro na reprodução de voz:", event.error);
        options?.onError?.();
      }

      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error(
      "Falha inesperada ao iniciar síntese de voz:",
      error,
    );

    options?.onError?.();
    onEnd?.();
  }
}

export function repeatLastSpeech(
  onStart?: () => void,
  onEnd?: () => void,
): void {
  if (!lastSpokenText) return;

  speak(lastSpokenText, onStart, onEnd);
}

export function stopSpeaking(): void {
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }
}

export function canRepeatSpeech(): boolean {
  return lastSpokenText !== null && lastSpokenText.trim().length > 0;
}
