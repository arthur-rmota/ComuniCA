import { recordHistory } from "../services/historyService";

let lastSpokenText: string | null = null;

export function speak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  const cleanText = text.trim();
  if (!cleanText) {
    onEnd?.();
    return;
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.error("Síntese de voz não suportada neste navegador.");
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

    utterance.onstart = () => {
      recordHistory(cleanText).catch((error) => {
        console.error("Erro ao registrar histórico de reprodução:", error);
      });
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") {
        console.error("Erro na reprodução de voz:", event.error);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Falha inesperada ao iniciar síntese de voz:", error);
    onEnd?.();
  }
}

export function repeatLastSpeech(
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!lastSpokenText) return;
  speak(lastSpokenText, onStart, onEnd);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function canRepeatSpeech(): boolean {
  return lastSpokenText !== null && lastSpokenText.trim().length > 0;
}