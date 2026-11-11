import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useProfileContext } from "../contexts/ProfileContext";
import { ProfileForm } from "../components/profile/ProfileForm";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";

export default function ManageProfilePage() {
  const navigate = useNavigate();
  const authorizationRef = useRef({
    setIsPinVerified: () => {},
    setIsEditing: () => {},
  });

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
    setIsEditing,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    handleVerifyPin,
    setShowPinPrompt,
  } = useProfileContext();

  authorizationRef.current = {
    setIsPinVerified: () => setIsPinVerified(false),
    setIsEditing: () => setIsEditing(false),
  };

  useEffect(() => {
    return () => {
      authorizationRef.current.setIsPinVerified();
      authorizationRef.current.setIsEditing();
    };
  }, []);

  const needsPin = Boolean(user?.pinHash && !isPinVerified);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [loading, user, navigate]);

  function handleBack() {
    setIsPinVerified(false);
    setIsEditing(false);
    setShowPinPrompt(false);
    setEnteredPin("");
    navigate("/perfil", { replace: true });
  }

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-[#383838]">
          Gerenciar perfil
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {needsPin ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-[#383838]">
              Verificar PIN de acesso
            </h2>

            <PinVerificationForm
              enteredPin={enteredPin}
              accessPinError={accessPinError}
              verifyingPin={verifyingPin}
              onPinChange={setEnteredPin}
              onSubmit={handleVerifyPin}
              onCancel={handleBack}
            />
          </>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold text-[#383838]">
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
        )}
      </section>
    </main>
  );
}
