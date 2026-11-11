
import type { SubmitEvent } from "react";

interface PinVerificationFormProps {
  enteredPin: string;
  accessPinError: string;
  verifyingPin: boolean;
  onPinChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function PinVerificationForm({
  enteredPin,
  accessPinError,
  verifyingPin,
  onPinChange,
  onSubmit,
  onCancel,
}: PinVerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="access-pin"
          className="mb-2 block font-medium text-[#383838]"
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
          className="flex-1 rounded-xl bg-[#383838] p-3 font-semibold text-white disabled:opacity-50"
        >
          {verifyingPin ? "Verificando..." : "Confirmar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-gray-200 p-3 font-semibold text-[#383838]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
