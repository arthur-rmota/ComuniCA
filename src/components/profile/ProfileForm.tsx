
import type { SubmitEvent } from "react";

interface ProfileFormProps {
  mode: "register" | "edit";
  name: string;
  email: string;
  error: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export function ProfileForm({
  mode,
  name,
  email,
  error,
  saving,
  onNameChange,
  onEmailChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const isEditing = mode === "edit";

  return (
    <form
      onSubmit={onSubmit}
      className={`${isEditing ? "" : "mt-6 "}flex flex-col gap-4`}
    >
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block font-medium text-app-text"
        >
          Nome
        </label>
        <input
          id="profile-name"
          type="text"
          required
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={isEditing ? undefined : "Digite seu nome"}
          className="w-full rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-3 text-app-text outline-none focus:border-[#6254A3]"
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="mb-2 block font-medium text-app-text"
        >
          E-mail
        </label>
        <input
          id="profile-email"
          type="email"
          required
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder={isEditing ? undefined : "Digite seu e-mail"}
          className="w-full rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-3 text-app-text outline-none focus:border-[#6254A3]"
        />
      </div>

      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}

      <div className={isEditing ? "flex gap-3" : ""}>
        <button
          type="submit"
          disabled={saving}
          className={`rounded-xl bg-brand-primary hover:bg-brand-hover transition-colors p-3 font-semibold text-white disabled:opacity-50 ${
            isEditing ? "flex-1" : "w-full"
          }`}
        >
          {saving
            ? isEditing
              ? "Salvando..."
              : "Cadastrando..."
            : isEditing
              ? "Salvar alterações"
              : "Cadastrar perfil"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-white p-3 font-semibold text-app-text"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
