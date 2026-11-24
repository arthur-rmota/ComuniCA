import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

import AppIcon from "../../components/common/AppIcon";
import { useProfileContext } from "../../contexts/ProfileContext";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { PinSetupForm } from "../../components/profile/PinSetupForm";
import PinAccessPage from "../../components/profile/PinAccessPage";

type ManageSection = "personal" | "pin";

export default function ManageProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState<ManageSection>(
    location.state?.recoveringPin === true ? "pin" : "personal",
  );

  const {
    user,
    loading,
    name,
    setName,
    email,
    setEmail,
    saving,
    error,
    handleUpdate,
    isPinVerified,
    setIsPinVerified,
    setEnteredPin,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    pinError,
    savingPin,
    handleChangePin,
    handleResetPin,
    setPinError,
    setAccessPinError,
    setPinSuccess,
    pinSuccess,
    isPinRecoveryAuthorized,
    clearPinRecovery,
  } = useProfileContext();

  const isRecoveringPin =
    isPinRecoveryAuthorized && location.state?.recoveringPin === true;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [loading, user, navigate]);

  const needsPin = Boolean(user?.pinHash && !isPinVerified && !isRecoveringPin);

  function handleBack() {
    clearPinRecovery();
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    setPin("");
    setConfirmPin("");
    setPinError("");
    setPinSuccess("");

    navigate("/perfil", { replace: true });
  }

  function handleSelectSection(section: ManageSection) {
    setActiveSection(section);
    setPin("");
    setConfirmPin("");
    setPinError("");
    setPinSuccess("");
  }

  async function handlePinSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (isRecoveringPin) {
      await handleResetPin(event);
      clearPinRecovery();
      return;
    }

    await handleChangePin(event);
  }

  useEffect(() => {
    return () => {
      setPinSuccess("");
    };
  }, [setPinSuccess]);

  if (loading || !user) {
    return null;
  }

  if (needsPin) {
    return <PinAccessPage title="Gerenciar perfil" onBack={handleBack} />;
  }

  const title = isRecoveringPin ? "Redefinir PIN" : "Gerenciar perfil";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      {/* Elementos decorativos */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Cabeçalho */}

        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar para o perfil"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="break-words px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              {title}
            </h1>
          </div>

          {/* Apresentação */}

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4 shadow-[0_5px_14px_rgba(194,65,12,0.05)]">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/75"
            >
              <AppIcon
                name={isRecoveringPin ? "ShieldCheck" : "UserRoundCog"}
                size={60}
              />
            </span>

            <div className="min-w-0">
              <p className="text-base font-extrabold text-[#42251D]">
                {isRecoveringPin
                  ? "Crie um novo código de acesso"
                  : "Personalize sua conta"}
              </p>

              <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
                {isRecoveringPin
                  ? "Escolha um PIN para continuar protegendo o aplicativo."
                  : "Atualize seus dados e as opções de segurança."}
              </p>
            </div>
          </div>
        </header>

        {/* Formulários de gerenciamento */}

        <section className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
          {pinSuccess && (
            <p
              role="status"
              className="mb-5 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-800"
            >
              {pinSuccess}
            </p>
          )}

          {/* Seletor de seção */}

          {user.pinHash && !isRecoveringPin && (
            <div
              role="group"
              aria-label="Opções de gerenciamento do perfil"
              className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F2ED] p-1.5"
            >
              <button
                type="button"
                onClick={() => handleSelectSection("personal")}
                aria-pressed={activeSection === "personal"}
                className={`min-h-12 rounded-xl px-2 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
                  activeSection === "personal"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-[#775A49]"
                }`}
              >
                Dados pessoais
              </button>

              <button
                type="button"
                onClick={() => handleSelectSection("pin")}
                aria-pressed={activeSection === "pin"}
                className={`min-h-12 rounded-xl px-2 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
                  activeSection === "pin"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-[#775A49]"
                }`}
              >
                Alterar PIN
              </button>
            </div>
          )}

          {/* Dados pessoais ou alteração do PIN */}

          {activeSection === "personal" || !user.pinHash ? (
            <>
              <h2 className="mb-5 text-lg font-extrabold text-[#42251D]">
                Dados pessoais
              </h2>

              <ProfileForm
                mode="edit"
                name={name}
                email={email}
                error={error}
                saving={saving}
                onNameChange={setName}
                onEmailChange={setEmail}
                onSubmit={handleUpdate}
                onCancel={handleBack}
              />
            </>
          ) : (
            <PinSetupForm
              mode="change"
              pin={pin}
              confirmPin={confirmPin}
              pinError={pinError}
              savingPin={savingPin}
              onPinChange={setPin}
              onConfirmPinChange={setConfirmPin}
              onSubmit={handlePinSubmit}
            />
          )}
        </section>
      </div>
    </main>
  );
}
