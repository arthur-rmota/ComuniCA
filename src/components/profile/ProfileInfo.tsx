import type { User } from "../../types/user";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const initial = user.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "U";

  return (
    <section className="relative flex min-h-28 items-center gap-4 overflow-hidden rounded-3xl border-2 border-white/70 bg-[#FBDDBA] px-4 py-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/20"
      />
      <div
        aria-hidden="true"
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white/75 text-2xl font-extrabold text-[#9A3412] shadow-sm"
      >
        {initial}
      </div>

      <div className="relative min-w-0 flex-1">
        
        <h2 className="break-words text-lg font-extrabold leading-tight text-[#42251D]">
          {user.name}
        </h2>
        <p className="mt-1 break-all text-sm text-[#775A49]">
          {user.email}
        </p>
      </div>
    </section>
  );
}
