import { useNavigate } from "react-router";
import {
  UserCircle,
  LockKeyhole,
  Bell,
  CircleHelp,
  LayoutGrid,
} from "lucide-react";

import { ProfileInfo } from "../components/profile/ProfileInfo";
import { PinSetupForm } from "../components/profile/PinSetupForm";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ProfileMenuItem } from "../components/profile/ProfileMenuItem";
import { useProfileContext } from "../contexts/ProfileContext";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    name,
    setName,
    email,
    setEmail,
    saving,
    error,
    handleRegister,
    setIsPinVerified,
    setEnteredPin,
    setAccessPinError,
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    pinError,
    savingPin,
    handleSavePin,
  } = useProfileContext();

  function handleManageProfile() {
    if (!user) return;

    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    setName(user.name);
    setEmail(user.email);

    navigate("/perfil/gerenciar");
  }

  function handleManageCategories() {
    if (!user) return;

    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    navigate("/perfil/categorias");
  }

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-6">
        <h1 className="text-center text-2xl font-semibold text-app-text">
          Perfil
        </h1>
      </header>

      {loading ? (
        <p className="mt-4 text-app-text">Carregando perfil...</p>
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
                onClick={handleManageProfile}
              />

              <ProfileMenuItem
                icon={LayoutGrid}
                label="Gerenciar categorias"
                onClick={handleManageCategories}
              />

              <div className="mx-4 h-px bg-app-background" />

              <div className="mx-4 h-px bg-app-background" />

              <ProfileMenuItem
                icon={LockKeyhole}
                label="Senha e Segurança"
                disabled
              />

              <div className="mx-4 h-px bg-app-background" />

              <ProfileMenuItem icon={Bell} label="Notificações" disabled />

              <div className="mx-4 h-px bg-app-background" />

              <ProfileMenuItem icon={CircleHelp} label="Idioma" disabled />
            </div>
          </section>
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
