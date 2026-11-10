export function speak(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!('speechSynthesis' in window)) {
    console.error('Síntese de voz não suportada neste navegador.');
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}