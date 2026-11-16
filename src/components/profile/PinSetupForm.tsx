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
  const inputClassName =
    "min-h-12 w-full rounded-xl border border-[#E7D5C8] bg-[#FFFCF9] px-4 py-3 text-base text-[#42251D] outline-none focus:border-brand-primary focus:ring-2 focus:ring-[#F8D8BF]";

  return (
    <section
      className={
        mode === "setup"
          ? "rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.05)]"
          : "rounded-2xl bg-white"
      }
    >
      <h2 className="mb-2 text-lg font-extrabold text-[#42251D]">
        {mode === "setup" ? "Definir PIN" : "Salvar novo PIN"}
      </h2>
      {mode === "setup" && (
        <p className="mb-5 text-sm leading-relaxed text-[#80685D]">
          Crie um código para proteger as opções de gerenciamento.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="pin" className="mb-2 block text-sm font-bold text-[#42251D]">
            PIN
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={6}
            value={pin}
            onChange={(event) => onPinChange(event.target.value.replace(/\D/g, ""))}
            placeholder="Digite de 4 a 6 dígitos"
            className={inputClassName}
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirm-pin"
            className="mb-2 block text-sm font-bold text-[#42251D]"
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
            placeholder="Digite o PIN novamente"
            className={inputClassName}
            required
          />
        </div>

        {pinError && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {pinError}
          </p>
        )}

        <button
          type="submit"
          disabled={savingPin}
          className="min-h-12 rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {savingPin ? "Salvando..." : mode === "setup" ? "Definir PIN" : "Salvar novo PIN"}
        </button>
      </form>
    </section>
  );
}
