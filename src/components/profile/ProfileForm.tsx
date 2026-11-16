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

  const inputClassName =
    "min-h-12 w-full rounded-xl border border-[#E7D5C8] bg-[#FFFCF9] px-4 py-3 text-base text-[#42251D] outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-[#F8D8BF]";

  return (
    <form
      onSubmit={onSubmit}
      className={`${isEditing ? "" : "mt-6 "}flex flex-col gap-5`}
    >
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block text-sm font-bold text-[#42251D]"
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
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="mb-2 block text-sm font-bold text-[#42251D]"
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
          className={inputClassName}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className={isEditing ? "flex gap-3" : ""}>
        <button
          type="submit"
          disabled={saving}
          className={`min-h-12 rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50 ${
            isEditing ? "flex-1" : "w-full"
          }`}
        >
          {saving
            ? isEditing
              ? "Salvando..."
              : "Cadastrando..."
            : isEditing
              ? "Salvar"
              : "Cadastrar perfil"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="min-h-12 flex-1 rounded-xl border border-[#E7D5C8] bg-white px-4 py-3 font-bold text-[#42251D] disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
