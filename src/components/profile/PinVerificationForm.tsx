import type { SubmitEvent } from "react";

interface PinVerificationFormProps {
  enteredPin: string;
  accessPinError: string;
  verifyingPin: boolean;
  onPinChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

interface PinVerificationFormProps {
  enteredPin: string;
  accessPinError: string;
  verifyingPin: boolean;
  onPinChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onForgotPin: () => void;
}

export function PinVerificationForm({
  enteredPin,
  accessPinError,
  verifyingPin,
  onPinChange,
  onSubmit,
  onCancel,
  onForgotPin,
}: PinVerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="access-pin"
          className="mb-2 block font-medium text-app-text"
        >
          PIN de acesso
        </label>

        <input
          id="access-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          required
          value={enteredPin}
          onChange={(event) =>
            onPinChange(event.target.value.replace(/\D/g, ""))
          }
          placeholder="Digite seu PIN"
          className="w-full rounded-xl border border-gray-300 p-3"
        />
      </div>

      {accessPinError && (
        <p
          role="alert"
          className="rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700"
        >
          {accessPinError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={verifyingPin}
          className="flex-1 rounded-xl bg-brand-primary hover:bg-brand-hover transition-colors p-3 font-semibold text-white disabled:opacity-50"
        >
          {verifyingPin ? "Verificando..." : "Confirmar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-gray-200 p-3 font-semibold text-app-text"
        >
          Cancelar
        </button>
      </div>
      <button
        type="button"
        onClick={onForgotPin}
        className="text-center text-sm font-semibold text-[#B86B00] underline underline-offset-4"
      >
        Esqueceu o PIN?
      </button>
    </form>
  );
}
