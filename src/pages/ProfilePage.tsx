import { ProfileInfo } from "../components/profile/ProfileInfo";
import { PinSetupForm } from "../components/profile/PinSetupForm";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useProfile } from "../hooks/useProfile";

function ProfilePage() {
  const {
    user,
    setUser,
    loading,
    name,
    setName,
    email,
    setEmail,
    saving,
    setSaving,
    error,
    setError,
    handleRegister,
    isPinVerified,
    setIsPinVerified,
    isEditing,
    setIsEditing,
    showPinPrompt,
    setShowPinPrompt,
    handleUpdate,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    setVerifyingPin,
    accessPinError,
    setAccessPinError,
    handleVerifyPin,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    pinError,
    savingPin,
    handleSavePin,
  } = useProfile();

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <h1 className="text-2xl font-semibold text-[#383838]">Perfil</h1>

      {loading ? (
        <p className="mt-4 text-[#383838]">Carregando perfil...</p>
      ) : user ? (
        <div className="mt-6 flex flex-col gap-4">
          <ProfileInfo user={user} />

          {!user.pinHash && (
            <PinSetupForm
              pin={pin}
              confirmPin={confirmPin}
              pinError={pinError}
              savingPin={savingPin}
              onPinChange={setPin}
              onConfirmPinChange={setConfirmPin}
              onSubmit={handleSavePin}
            />
          )}

          <button
            type="button"
            onClick={() => {
              if (user.pinHash && !isPinVerified) {
                setShowPinPrompt(true);
                return;
              }

              setName(user.name);
              setEmail(user.email);
              setIsEditing(true);
            }}
            className="rounded-xl bg-[#383838] p-3 font-semibold text-white"
          >
            Editar perfil
          </button>

          {showPinPrompt && user.pinHash && (
            <section className="rounded-xl bg-white p-4">
              <h2 className="mb-4 text-lg font-semibold text-[#383838]">
                Verificar PIN de acesso
              </h2>

              <PinVerificationForm
                enteredPin={enteredPin}
                accessPinError={accessPinError}
                verifyingPin={verifyingPin}
                onPinChange={setEnteredPin}
                onSubmit={handleVerifyPin}
                onCancel={() => {
                  setShowPinPrompt(false);
                  setEnteredPin("");
                }}
              />
            </section>
          )}

          {isEditing && (
            <ProfileForm
              mode="edit"
              name={name}
              email={email}
              error={error}
              saving={saving}
              onNameChange={setName}
              onEmailChange={setEmail}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditing(false);
                setIsPinVerified(false);
                setError("");
              }}
            />
          )}
        </div>
      ) : (
        <ProfileForm
          mode="register"
          name={name}
          email={email}
          error={error}
          saving={saving}
          onNameChange={setName}
          onEmailChange={setEmail}
          onSubmit={handleRegister}
        />
      )}
    </main>
  );
}

export default ProfilePage;
