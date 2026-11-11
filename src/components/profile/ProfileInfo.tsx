import type { User } from "../../types/user";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <>
      <p className="text-lg text-[#383838]">
        Olá, {user.name}!
      </p>

      <p className="text-[#383838]">
        E-mail: {user.email}
      </p>
    </>
  );
}
