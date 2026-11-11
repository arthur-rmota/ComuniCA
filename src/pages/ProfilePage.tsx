import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { User } from "../types/user";

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const users = await userService.getAll();
        setUser(users[0] ?? null);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, []);

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const existingUsers = await userService.getAll();

      if (existingUsers.length > 0) {
        setError("Já existe um perfil cadastrado.");
        return;
      }

      const now = new Date().toISOString();

      const newUser: User = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: now,
        updatedAt: now,
      };

      if (!newUser.name || !newUser.email) {
        setError("Preencha todos os campos.");
        return;
      }

      await userService.create(newUser);
      setUser(newUser);
    } catch (err) {
      console.error("Erro ao cadastrar perfil:", err);
      setError("Não foi possível cadastrar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || saving) return;

    setError("");
    setSaving(true);

    try {
      const updatedName = name.trim();
      const updatedEmail = email.trim().toLowerCase();

      if (!updatedName || !updatedEmail) {
        setError("Preencha todos os campos.");
        return;
      }

      const updatedAt = new Date().toISOString();

      await userService.update(user.id, {
        name: updatedName,
        email: updatedEmail,
        updatedAt,
      });

      setUser({
        ...user,
        name: updatedName,
        email: updatedEmail,
        updatedAt,
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <h1 className="text-2xl font-semibold text-[#383838]">Perfil</h1>

      {loading ? (
        <p className="mt-4 text-[#383838]">Carregando perfil...</p>
      ) : user ? (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-lg text-[#383838]">Olá, {user.name}!</p>

          <p className="text-[#383838]">E-mail: {user.email}</p>

          <button
            type="button"
            onClick={() => {
              setName(user.name);
              setEmail(user.email);
              setIsEditing(true);
            }}
            className="rounded-xl bg-[#383838] p-3 font-semibold text-white"
          >
            Editar perfil
          </button>

          {isEditing && (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="mb-2 block font-medium text-[#383838]"
                >
                  Nome
                </label>

                <input
                  id="edit-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl bg-white p-3 text-[#383838]"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-2 block font-medium text-[#383838]"
                >
                  E-mail
                </label>

                <input
                  id="edit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl bg-white p-3 text-[#383838]"
                />
              </div>

              {error && (
                <p role="alert" className="text-red-700">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#383838] p-3 font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-xl bg-white p-3 font-semibold text-[#383838]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-medium text-[#383838]"
            >
              Nome
            </label>

            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite seu nome"
              className="w-full rounded-xl bg-white p-3 text-[#383838]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium text-[#383838]"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full rounded-xl bg-white p-3 text-[#383838]"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#383838] p-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Cadastrando..." : "Cadastrar perfil"}
          </button>
        </form>
      )}
    </main>
  );
}

export default ProfilePage;
