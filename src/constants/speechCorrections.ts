const SPEECH_CORRECTIONS: Record<string, string> = {
  sim: "audio/corrections/sim.wav",
};

export function getSpeechCorrection(text: string): string | null {
  const normalizedText = text
    .trim()
    .toLocaleLowerCase("pt-BR")
    .replace(/[.!]+$/, "")
    .trim();

  const correction = SPEECH_CORRECTIONS[normalizedText];

  if (!correction) return null;

  return `${import.meta.env.BASE_URL}${correction}`;
}
