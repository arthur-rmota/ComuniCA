import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useProfileContext } from "../../contexts/ProfileContext";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { PinVerificationForm } from "../../components/profile/PinVerificationForm";
import { PinSetupForm } from "../../components/profile/PinSetupForm";

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
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    handleVerifyPin,
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

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-app-text">
          Gerenciar perfil
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {pinSuccess && (
          <p
            role="status"
            className="mb-4 rounded-xl bg-green-100 p-3 text-green-800"
          >
            {pinSuccess}
          </p>
        )}
        {needsPin ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-app-text">
              Verificar PIN de acesso
            </h2>

            <PinVerificationForm
              enteredPin={enteredPin}
              accessPinError={accessPinError}
              verifyingPin={verifyingPin}
              onPinChange={setEnteredPin}
              onSubmit={handleVerifyPin}
              onCancel={handleBack}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </>
        ) : (
          <>
            {user.pinHash && !isRecoveringPin && (
              <div className="mb-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectSection("personal")}
                  aria-pressed={activeSection === "personal"}
                  className={`rounded-xl p-3 text-sm font-semibold ${
                    activeSection === "personal"
                      ? "bg-brand-primary hover:bg-brand-hover transition-colors text-white"
                      : "bg-gray-100 text-app-text"
                  }`}
                >
                  Dados pessoais
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSection("pin")}
                  aria-pressed={activeSection === "pin"}
                  className={`rounded-xl p-3 text-sm font-semibold ${
                    activeSection === "pin"
                      ? "bg-brand-primary hover:bg-brand-hover transition-colors text-white"
                      : "bg-gray-100 text-app-text"
                  }`}
                >
                  Alterar PIN
                </button>
              </div>
            )}

            {activeSection === "personal" || !user.pinHash ? (
              <>
                <h2 className="mb-4 text-lg font-semibold text-app-text">
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
          </>
        )}
      </section>
    </main>
  );
}
