import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { useProfile } from "../hooks/useProfile";

type ProfileContextValue = ReturnType<typeof useProfile>;

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  const location = useLocation();

  const { setIsPinVerified, setEnteredPin, setAccessPinError } = profile;

  useEffect(() => {
    const isProtectedRoute =
      location.pathname === "/perfil/gerenciar" ||
      location.pathname === "/perfil/categorias";

    if (!isProtectedRoute) {
      setIsPinVerified(false);
      setEnteredPin("");
      setAccessPinError("");
    }
  }, [location.pathname, setIsPinVerified, setEnteredPin, setAccessPinError]);

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfileContext deve ser usado dentro de ProfileProvider.",
    );
  }

  return context;
}
