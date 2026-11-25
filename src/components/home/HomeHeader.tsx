import { useNavigate } from "react-router";
import { useProfileContext } from "../../contexts/ProfileContext";

function HomeHeader() {
  const { user } = useProfileContext();
  const navigate = useNavigate();

  const firstName = user?.name?.trim().split(/\s+/)[0] || "";

  return (
    <header className="relative mb-6 pt-2 md:mb-8">
      <div className="mb-3 flex items-center justify-center gap-2 xl:hidden">
        <img
          src={`${import.meta.env.BASE_URL}comunica-dark-icon.png`}
          alt=""
          aria-hidden="true"
          className="h-14 w-14 object-contain"
        />

        <span className="text-3xl font-black tracking-tight text-[#592B1D]">
          Comuni
          <span className="text-brand-primary">CA</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#42251D] md:text-3xl xl:text-4xl">
            {firstName ? `Olá, ${firstName}!` : "Olá, Usuário!"} 👋
          </h1>

          <p className="mt-1 text-sm font-medium text-[#80685D] md:text-base">
            Vamos nos comunicar?
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/perfil")}
          aria-label="Abrir perfil"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F8D8BF] text-lg font-bold text-[#9A3412] shadow-sm transition-transform active:scale-95 md:h-16 md:w-16 md:text-xl"
        >
          {user?.name?.trim().charAt(0).toUpperCase() || "U"}
        </button>
      </div>
    </header>
  );
}

export default HomeHeader;
