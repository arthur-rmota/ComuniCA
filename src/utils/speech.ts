import { recordHistory } from "../services/historyService";

import { speakNeural, stopNeuralSpeech } from "../services/neuralSpeechService";

let lastSpokenText: string | null = null;
let cancelCurrent: (() => void) | null = null;

const NEURAL_TIMEOUT = 15000;

type SpeechOptions = {
  volume?: number;
  onError?: () => void;
};

function isNativeSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

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

  stopSpeaking();

  lastSpokenText = cleanText;

  const volume = Math.max(0, Math.min(1, options?.volume ?? 1));

  let finished = false;
  let started = false;
  let usingNative = false;

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function finish(): void {
    if (finished) return;

    finished = true;

    clearTimeout(timeout);

    if (cancelCurrent === cancel) {
      cancelCurrent = null;
    }

    onEnd?.();
  }

  function cancel(): void {
    if (finished) return;

    finished = true;

    clearTimeout(timeout);

    if (cancelCurrent === cancel) {
      cancelCurrent = null;
    }

    stopNeuralSpeech();

    if (isNativeSpeechSupported()) {
      window.speechSynthesis.cancel();
    }

    onEnd?.();
  }

  function handleStart(): void {
    if (finished || started) return;

    started = true;

    clearTimeout(timeout);

    void recordHistory(cleanText).catch((error) => {
      console.error("Erro ao registrar histórico de reprodução:", error);
    });

    onStart?.();
  }

  function handleError(error: unknown): void {
    if (finished) return;

    console.error("Erro na reprodução de voz:", error);

    try {
      options?.onError?.();
    } finally {
      finish();
    }
  }

  function speakNative(): void {
    if (finished || usingNative) return;

    usingNative = true;

    clearTimeout(timeout);

    stopNeuralSpeech();

    if (!isNativeSpeechSupported()) {
      handleError("Síntese de voz nativa indisponível.");
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = volume;

      utterance.onstart = handleStart;

      utterance.onend = finish;

      utterance.onerror = (event) => {
        if (event.error === "interrupted" || event.error === "canceled") {
          finish();
          return;
        }

        handleError(event.error);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      handleError(error);
    }
  }

  cancelCurrent = cancel;

  timeout = setTimeout(() => {
    if (!finished && !started && !usingNative) {
      console.warn("Tempo limite da voz neural atingido.");

      speakNative();
    }
  }, NEURAL_TIMEOUT);

  void speakNeural(cleanText, 1, {
    volume,

    onStart: () => {
      if (!usingNative) {
        handleStart();
      }
    },
  })
    .then(() => {
      if (!usingNative) {
        finish();
      }
    })
    .catch((error) => {
      if (finished || usingNative) return;

      console.warn("Falha na voz neural:", error);

      if (started) {
        handleError(error);
        return;
      }

      speakNative();
    });
}

export function repeatLastSpeech(
  onStart?: () => void,
  onEnd?: () => void,
): void {
  if (!lastSpokenText) return;

  speak(lastSpokenText, onStart, onEnd);
}

export function stopSpeaking(): void {
  if (cancelCurrent) {
    cancelCurrent();
    return;
  }

  stopNeuralSpeech();

  if (isNativeSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function canRepeatSpeech(): boolean {
  return lastSpokenText !== null && lastSpokenText.trim().length > 0;
}
