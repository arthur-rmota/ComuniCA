import type { SubmitEvent } from "react";

interface PinSetupFormProps {
  pin: string;
  confirmPin: string;
  mode?: "setup" | "change";
  pinError: string;
  savingPin: boolean;
  onPinChange: (value: string) => void;
  onConfirmPinChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

export function PinSetupForm({
  pin,
  mode = "setup",
  confirmPin,
  pinError,
  savingPin,
  onPinChange,
  onConfirmPinChange,
  onSubmit,
}: PinSetupFormProps) {
  return (
    <section className="rounded-xl bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-app-text">
        {mode === "setup" ? "Definir PIN" : "Salvar novo PIN"}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="pin"
            className="mb-2 block font-medium text-app-text"
          >
            PIN
          </label>

          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={6}
            value={pin}
            onChange={(event) =>
              onPinChange(event.target.value.replace(/\D/g, ""))
            }
            placeholder="Digite um PIN de 4 a 6 dígitos"
            className="w-full rounded-xl border border-gray-300 p-3"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirm-pin"
            className="mb-2 block font-medium text-app-text"
          >
            Confirmar PIN
          </label>

          <input
            id="confirm-pin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={6}
            value={confirmPin}
            onChange={(event) =>
              onConfirmPinChange(event.target.value.replace(/\D/g, ""))
            }
            placeholder="Digite novamente o PIN"
            className="w-full rounded-xl border border-gray-300 p-3"
            required
          />
        </div>

        {pinError && (
          <p role="alert" className="text-red-700">
            {pinError}
          </p>
        )}

        <button
          type="submit"
          disabled={savingPin}
          className="rounded-xl bg-brand-primary hover:bg-brand-hover transition-colors p-3 font-semibold text-white disabled:opacity-50"
        >
          Definir PIN
        </button>
      </form>
    </section>
  );
}
