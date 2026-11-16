import { useState, type SubmitEvent } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { verifyRecoveryPassword } from "../../services/pinRecoveryService";
import { useProfileContext } from "../../contexts/ProfileContext";

export default function RecoverPinPage() {
  const navigate = useNavigate();
  const { authorizePinRecovery } = useProfileContext();
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!verifyRecoveryPassword(recoveryPassword)) {
      setError("Senha de recuperação incorreta.");
      return;
    }

    setError("");
    setRecoveryPassword("");

    authorizePinRecovery();

    navigate("/perfil/gerenciar", {
      replace: true,
      state: { recoveringPin: true },
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/perfil", { replace: true })}
              aria-label="Voltar para o perfil"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              Recuperar PIN
            </h1>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4 shadow-[0_5px_14px_rgba(194,65,12,0.05)]">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-brand-primary"
            >
              <ShieldCheck size={26} strokeWidth={2.3} />
            </span>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-[#42251D]">
                Esqueceu seu PIN?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
                Use sua senha de recuperação para criar um novo código.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
          <div className="mb-5 flex items-center gap-2">
            <KeyRound size={22} className="text-brand-primary" aria-hidden="true" />
            <h2 className="text-lg font-extrabold text-[#42251D]">
              Senha de recuperação
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="recovery-password"
                className="mb-2 block text-sm font-bold text-[#42251D]"
              >
                <p>Digite sua senha</p> Dica: a senha é "o flamengo é seleção"
              </label>

              <div className="flex min-h-12 w-full items-center rounded-xl border border-[#E7D5C8] bg-[#FFFCF9] focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-[#F8D8BF]">
                <input
                  id="recovery-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  required
                  value={recoveryPassword}
                  onChange={(event) => {
                    setRecoveryPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Senha de recuperação"
                  className="min-w-0 flex-1 rounded-l-xl bg-transparent px-4 py-3 text-base text-[#42251D] outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-xl text-[#775A49] focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  {showPassword ? (
                    <EyeOff size={22} aria-hidden="true" />
                  ) : (
                    <Eye size={22} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="min-h-12 rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Continuar
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
