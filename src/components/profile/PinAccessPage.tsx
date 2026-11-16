
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { useProfileContext } from "../../contexts/ProfileContext";
import { PinVerificationForm } from "./PinVerificationForm";

interface PinAccessPageProps {
  title: string;
  onBack: () => void;
}

export default function PinAccessPage({
  title,
  onBack,
}: PinAccessPageProps) {
  const navigate = useNavigate();

  const {
    enteredPin,
    setEnteredPin,
    accessPinError,
    verifyingPin,
    handleVerifyPin,
  } = useProfileContext();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-5 pb-28 pt-4">
      {/* Decoração no fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#FFE6D0]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Cabeçalho */}
        <header className="mb-6 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 flex min-h-11 items-center gap-2 text-sm font-medium text-[#775044] transition-colors hover:text-brand-primary"
          >
            <ArrowLeft
              size={21}
              strokeWidth={2.4}
              aria-hidden="true"
            />

            Voltar
          </button>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#42251D]">
            {title}
          </h1>
        </header>

        {/* Formulário de verificação */}
        <section
          aria-labelledby="pin-access-title"
          className="rounded-3xl border border-[#F5E9DF] bg-white px-5 py-6 shadow-[0_5px_14px_rgba(41,37,36,0.06)]"
        >
          <h2
            id="pin-access-title"
            className="mb-5 text-lg font-extrabold text-[#42251D]"
          >
            Verificar PIN de acesso
          </h2>

          <PinVerificationForm
            enteredPin={enteredPin}
            accessPinError={accessPinError}
            verifyingPin={verifyingPin}
            onPinChange={setEnteredPin}
            onSubmit={handleVerifyPin}
            onCancel={onBack}
            onForgotPin={() =>
              navigate("/perfil/recuperar-pin")
            }
          />
        </section>
      </div>
    </main>
  );
}
