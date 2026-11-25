import { Piper } from "@pedrobef/vozz/piper";

import {
  getSpeechCacheKey,
  getCachedSpeech,
  saveCachedSpeech,
} from "./speechCacheService";

import { getSpeechCorrection } from "../constants/speechCorrections";

let enginePromise: Promise<Piper> | null = null;
let audioContext: AudioContext | null = null;
let activeSource: AudioBufferSourceNode | null = null;
let requestId = 0;

type NeuralSpeechOptions = {
  volume?: number;
  onStart?: () => void;
};

export type NeuralSpeechStatus = "idle" | "loading" | "ready" | "error";

let neuralSpeechStatus: NeuralSpeechStatus = "idle";

const statusListeners = new Set<() => void>();

function setNeuralSpeechStatus(status: NeuralSpeechStatus): void {
  neuralSpeechStatus = status;

  statusListeners.forEach((listener) => listener());
}

export function getNeuralSpeechStatus(): NeuralSpeechStatus {
  return neuralSpeechStatus;
}

export function subscribeNeuralSpeechStatus(listener: () => void): () => void {
  statusListeners.add(listener);

  return () => {
    statusListeners.delete(listener);
  };
}

export function loadNeuralSpeech(): Promise<Piper> {
  if (!enginePromise) {
    enginePromise = Promise.resolve()
      .then(() =>
        Piper.carregar({
          dispositivo: "wasm",
          cache: true,
        }),
      )
      .then((engine) => {
        setNeuralSpeechStatus("ready");

        return engine;
      })
      .catch((error) => {
        enginePromise = null;

        setNeuralSpeechStatus("error");

        throw error;
      });

    setNeuralSpeechStatus("loading");
  }

  return enginePromise;
}

function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContext();
  }

  return audioContext;
}

export function stopNeuralSpeech(): void {
  requestId++;

  if (activeSource) {
    const source = activeSource;

    activeSource = null;

    try {
      source.stop();
    } catch {
      // A reprodução já foi encerrada.
    }
  }
}

async function loadCorrectedSpeech(text: string): Promise<ArrayBuffer | null> {
  const correction = getSpeechCorrection(text);

  if (!correction) return null;

  try {
    const response = await fetch(correction);

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const wav = await response.arrayBuffer();

    console.info("[Piper] Áudio de pronúncia corrigida.");

    return wav;
  } catch (error) {
    console.warn("Não foi possível carregar a pronúncia corrigida:", error);

    return null;
  }
}

export async function speakNeural(
  text: string,
  speed = 1,
  options?: NeuralSpeechOptions,
): Promise<void> {
  const cleanText = text.trim();

  if (!cleanText) return;

  stopNeuralSpeech();

  const currentRequest = requestId;
  const context = getAudioContext();

  if (context.state !== "running") {
    await context.resume();
  }

  const normalizedSpeed = Math.max(0.5, Math.min(2, speed));

  const cacheKey = await getSpeechCacheKey(cleanText, normalizedSpeed);

  let wav = normalizedSpeed === 1 ? await loadCorrectedSpeech(cleanText) : null;

  if (currentRequest !== requestId) return;

  const fromCorrection = wav !== null;

  if (!wav) {
    wav = await getCachedSpeech(cacheKey);
  }

  if (currentRequest !== requestId) return;

  const fromCache = !fromCorrection && wav !== null;

  if (!wav) {
    const engine = await loadNeuralSpeech();

    if (currentRequest !== requestId) return;

    const audio = await engine.falar(cleanText, {
      velocidade: normalizedSpeed,
    });

    if (currentRequest !== requestId) return;

    wav = audio.paraWav();

    console.info("[Piper] Novo áudio gerado.");
  } else if (fromCache) {
    console.info("[Piper] Áudio recuperado do cache.");
  }

  const buffer = await context.decodeAudioData(wav.slice(0));

  if (currentRequest !== requestId) return;

  if (!fromCache && !fromCorrection) {
    void saveCachedSpeech(cacheKey, wav);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();

  source.buffer = buffer;

  gain.gain.value = Math.max(0, Math.min(1, options?.volume ?? 1));

  source.connect(gain);
  gain.connect(context.destination);

  activeSource = source;

  await new Promise<void>((resolve, reject) => {
    function cleanup() {
      source.disconnect();
      gain.disconnect();

      if (activeSource === source) {
        activeSource = null;
      }
    }

    source.onended = () => {
      cleanup();
      resolve();
    };

    try {
      source.start();
      options?.onStart?.();
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}
