import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import type { User } from "../types/user";
import { pinService } from "../services/pinService";
import { useNavigate } from "react-router";

export function useProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [accessPinError, setAccessPinError] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const users = await userService.getAll();
        const savedUser = users[0] ?? null;

        setUser(savedUser);
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

    if (user.pinHash && !isPinVerified) {
      setError("Informe o PIN para editar o perfil.");
      setIsEditing(false);
      setShowPinPrompt(true);
      return;
    }

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
      setIsPinVerified(false);
      navigate("/perfil", { replace: true });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleVerifyPin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.pinHash || verifyingPin) return;

    const lockedUntil = user.pinLockedUntil ?? null;

    if (lockedUntil !== null && Date.now() < lockedUntil) {
      const remainingMinutes = Math.ceil((lockedUntil - Date.now()) / 60_000);

      setAccessPinError(
        `Acesso bloqueado. Tente novamente em ${remainingMinutes} minuto(s).`,
      );
      return;
    }

    setAccessPinError("");
    setVerifyingPin(true);

    try {
      const lockExpired =
        user.pinLockedUntil != null && Date.now() >= user.pinLockedUntil;

      if (lockExpired) {
        await userService.update(user.id, {
          failedPinAttempts: 0,
          pinLockedUntil: null,
        });

        setUser({
          ...user,
          failedPinAttempts: 0,
          pinLockedUntil: null,
        });
      }

      const isValid = await pinService.verify(enteredPin, user.pinHash);

      if (!isValid) {
        const attempts = lockExpired ? 1 : (user.failedPinAttempts ?? 0) + 1;

        const nextLockedUntil = attempts >= 5 ? Date.now() + 5 * 60_000 : null;

        await userService.update(user.id, {
          failedPinAttempts: attempts,
          pinLockedUntil: nextLockedUntil,
        });

        setUser({
          ...user,
          failedPinAttempts: attempts,
          pinLockedUntil: nextLockedUntil,
        });

        setEnteredPin("");

        if (nextLockedUntil !== null) {
          setAccessPinError(
            "Muitas tentativas incorretas. Acesso bloqueado por 5 minutos.",
          );
        } else {
          setAccessPinError(
            `PIN incorreto. Restam ${5 - attempts} tentativa(s).`,
          );
        }

        return;
      }

      await userService.update(user.id, {
        failedPinAttempts: 0,
        pinLockedUntil: null,
      });

      setUser({
        ...user,
        failedPinAttempts: 0,
        pinLockedUntil: null,
      });

      setAccessPinError("");
      setIsPinVerified(true);
      setShowPinPrompt(false);
      setEnteredPin("");

      setName(user.name);
      setEmail(user.email);
      setIsEditing(false);

    } catch (error) {
      console.error("Erro ao verificar PIN:", error);
      setAccessPinError("Não foi possível verificar o PIN.");
    } finally {
      setVerifyingPin(false);
    }
  }

  async function handleSavePin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || user.pinHash || savingPin) return;

    setPinError("");

    if (!/^\d{4,6}$/.test(pin)) {
      setPinError("O PIN deve conter de 4 a 6 dígitos.");
      return;
    }

    if (pin !== confirmPin) {
      setPinError("Os PINs não coincidem.");
      return;
    }

    setSavingPin(true);

    try {
      const pinHash = await pinService.hash(pin);
      const updatedAt = new Date().toISOString();

      const updated = await userService.update(user.id, {
        pinHash,
        updatedAt,
      });

      if (updated === 0) {
        throw new Error("Usuário não encontrado.");
      }

      setUser({
        ...user,
        pinHash,
        updatedAt,
      });

      setPin("");
      setConfirmPin("");
      setIsPinVerified(false);
      setIsEditing(false);
      setShowPinPrompt(false);
    } catch (error) {
      console.error("Erro ao salvar PIN:", error);
      setPinError("Não foi possível salvar o PIN.");
    } finally {
      setSavingPin(false);
    }
  }

  return {
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
  };
}
