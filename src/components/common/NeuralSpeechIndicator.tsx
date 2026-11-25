import { useSyncExternalStore } from "react";
import { LoaderCircle } from "lucide-react";

import {
  getNeuralSpeechStatus,
  subscribeNeuralSpeechStatus,
} from "../../services/neuralSpeechService";

function NeuralSpeechIndicator() {
  const status = useSyncExternalStore(
    subscribeNeuralSpeechStatus,
    getNeuralSpeechStatus,
  );

  if (status !== "loading") {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-50 mx-auto max-w-lg"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-brand-soft p-3 text-brand-hover shadow-lg">
        <LoaderCircle
          size={26}
          aria-hidden="true"
          className="shrink-0 motion-safe:animate-spin"
        />

        <div className="min-w-0">
          <p className="text-sm font-extrabold">Preparando voz neural...</p>
        </div>
      </div>
    </div>
  );
}

export default NeuralSpeechIndicator;
