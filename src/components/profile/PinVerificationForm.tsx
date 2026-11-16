import type { SubmitEvent } from "react";

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
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="access-pin"
          className="mb-2 block text-sm font-bold text-[#42251D]"
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
          className="min-h-12 w-full rounded-xl border border-[#E7D5C8] bg-[#FFFCF9] px-4 py-3 text-base text-[#42251D] outline-none focus:border-brand-primary focus:ring-2 focus:ring-[#F8D8BF]"
        />
      </div>

      {accessPinError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          {accessPinError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={verifyingPin}
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#E7D5C8] bg-white px-3 py-3 font-bold text-[#42251D] disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={verifyingPin}
          className="min-h-12 min-w-0 flex-1 rounded-xl bg-brand-primary px-3 py-3 font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {verifyingPin ? "Verificando..." : "Confirmar"}
        </button>
      </div>

      <button
        type="button"
        onClick={onForgotPin}
        disabled={verifyingPin}
        className="min-h-11 self-center px-3 text-center text-sm font-bold text-brand-primary underline underline-offset-4 disabled:opacity-50"
      >
        Esqueceu o PIN?
      </button>
    </form>
  );
}
