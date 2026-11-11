import { ProfileInfo } from "../components/profile/ProfileInfo";
import { PinSetupForm } from "../components/profile/PinSetupForm";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useProfileContext } from "../contexts/ProfileContext";
import { UserCircle, LockKeyhole, Bell, CircleHelp } from "lucide-react";
import { ProfileMenuItem } from "../components/profile/ProfileMenuItem";
import { useNavigate } from "react-router";

function ProfilePage() {
  const navigate = useNavigate();
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
  } = useProfileContext();

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="mb-6 pt-6">
        <h1 className="text-center text-2xl font-semibold text-[#383838]">
          Perfil
        </h1>
      </header>

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

          <section className="mt-2">
            <h2 className="mb-3 px-3 text-lg font-medium text-[#888888]">
              Conta
            </h2>

            <div className="overflow-hidden rounded-2xl bg-white">
              <ProfileMenuItem
                icon={UserCircle}
                label="Gerenciar perfil"
                onClick={() => {
                  setIsPinVerified(false);
                  setShowPinPrompt(false);
                  setEnteredPin("");
                  setName(user.name);
                  setEmail(user.email);
                  navigate("/perfil/gerenciar");
                }}
              />

              <div
                className="mx-4"
                style={{ height: 1, backgroundColor: "#E5E5E5" }}
              />

              <ProfileMenuItem
                icon={LockKeyhole}
                label="Senha e Segurança"
                disabled
              />

              <div
                className="mx-4"
                style={{ height: 1, backgroundColor: "#E5E5E5" }}
              />

              <ProfileMenuItem icon={Bell} label="Notificações" disabled />

              <div
                className="mx-4"
                style={{ height: 1, backgroundColor: "#E5E5E5" }}
              />

              <ProfileMenuItem icon={CircleHelp} label="Idioma" disabled />
            </div>
          </section>

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
