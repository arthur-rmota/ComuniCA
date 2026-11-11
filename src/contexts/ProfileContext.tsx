
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useProfile } from "../hooks/useProfile";

type ProfileContextValue = ReturnType<typeof useProfile>;

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const profile = useProfile();

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
      "useProfileContext deve ser usado dentro de ProfileProvider."
    );
  }

  return context;
}
