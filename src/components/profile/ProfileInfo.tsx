import type { User } from "../../types/user";
import { UserRound } from "lucide-react";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <section
      className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm"
      style={{ minHeight: 88 }}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        style={{
          width: 56,
          height: 56,
          backgroundColor: "#E3DDF8",
        }}
      >
        <UserRound size={30} strokeWidth={2} color="#6254A3" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[18px] font-semibold leading-tight text-[#383838]">
          {user.name}
        </h2>

        <p className="mt-1 truncate text-[13px] text-[#858585]">{user.email}</p>
      </div>
    </section>
  );
}
