import { useNavigate } from "react-router";

import AppIcon from "../../components/common/AppIcon";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { PinSetupForm } from "../../components/profile/PinSetupForm";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { ProfileMenuItem } from "../../components/profile/ProfileMenuItem";
import { useProfileContext } from "../../contexts/ProfileContext";

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

  function resetProtectedAccess() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
  }

  function handleManageProfile() {
    if (!user) return;

    resetProtectedAccess();
    setName(user.name);
    setEmail(user.email);
    navigate("/perfil/gerenciar");
  }

  function handleManageCategories() {
    if (!user) return;

    resetProtectedAccess();
    navigate("/perfil/categorias");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-44 w-44 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-6 flex items-center justify-center gap-3 pt-3">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE0BD]"
          >
            <AppIcon name="UserRound" size={44} />
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#42251D]">
            Perfil
          </h1>
        </header>

        {loading ? (
          <p className="rounded-3xl bg-white p-5 text-sm text-[#80685D] shadow-sm">
            Carregando perfil...
          </p>
        ) : user ? (
          <div className="flex flex-col gap-5">
            <ProfileInfo user={user} />

            {!user.pinHash && (
              <section aria-label="Configuração de segurança">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <AppIcon name="ShieldCheck" size={36} />

                  <h2 className="text-lg font-extrabold text-[#42251D]">
                    Proteja suas configurações
                  </h2>
                </div>

                <PinSetupForm
                  pin={pin}
                  confirmPin={confirmPin}
                  pinError={pinError}
                  savingPin={savingPin}
                  onPinChange={setPin}
                  onConfirmPinChange={setConfirmPin}
                  onSubmit={handleSavePin}
                />
              </section>
            )}

            <section aria-label="Opções da conta">
              <h2 className="mb-3 px-1 text-lg font-extrabold text-[#42251D]">
                Minha conta
              </h2>

              <div className="divide-y divide-[#F1E4D9] overflow-hidden rounded-3xl border border-[#F5E9DF] bg-white shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
                <ProfileMenuItem
                  icon="UserRoundCog"
                  label="Gerenciar perfil"
                  onClick={handleManageProfile}
                  accent="orange"
                />

                <ProfileMenuItem
                  icon="LayoutGrid"
                  label="Gerenciar categorias"
                  onClick={handleManageCategories}
                  accent="green"
                />

                <ProfileMenuItem
                  icon="History"
                  label="Histórico de mensagens"
                  onClick={() => navigate("/historico")}
                  accent="blue"
                />

                <ProfileMenuItem
                  icon="LockKeyhole"
                  label="Senha e Segurança"
                  accent="purple"
                  disabled
                />

                <ProfileMenuItem
                  icon="CircleHelp"
                  label="Idioma"
                  accent="orange"
                  disabled
                />

                <ProfileMenuItem
                  icon="Info"
                  label="Sobre o ComuniCA"
                  onClick={() => navigate("/sobre")}
                  accent="purple"
                />
              </div>
            </section>
          </div>
        ) : (
          <section className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
            <h2 className="text-lg font-extrabold text-[#42251D]">
              Vamos criar seu perfil?
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[#80685D]">
              Cadastre seus dados para personalizar o ComuniCA.
            </p>

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
          </section>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;
