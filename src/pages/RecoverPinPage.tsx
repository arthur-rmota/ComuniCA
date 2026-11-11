import { useState, type SubmitEvent } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { verifyRecoveryPassword } from "../services/pinRecoveryService";
import { useProfileContext } from "../contexts/ProfileContext";

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
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={() => navigate("/perfil", { replace: true })}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-[#383838]">Recuperar PIN</h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold text-[#383838]">
          Esqueceu seu PIN?
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          Insira a senha "o flamengo é seleção" para redefinir seu PIN de
          acesso.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="recovery-password"
              className="mb-2 block font-medium text-[#383838]"
            >
              Senha de recuperação
            </label>

            <div className="flex w-full items-center rounded-xl border border-gray-300 bg-white focus-within:border-gray-500">
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
                placeholder="Digite a senha"
                className="min-w-0 flex-1 rounded-l-xl bg-transparent p-3 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                className="flex h-11 w-12 shrink-0 items-center justify-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-100 p-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-[#383838] p-3 font-semibold text-white"
          >
            Continuar
          </button>
        </form>
      </section>
    </main>
  );
}
