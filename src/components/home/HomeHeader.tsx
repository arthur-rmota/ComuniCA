import { useProfileContext } from "../../contexts/ProfileContext";

function HomeHeader() {
  const { user } = useProfileContext();
  
  return (
    <header className="flex items-center justify-between px-2 py-2">
      <h1 className="text-2xl font-semibold text-app-text">
        Olá, {user?.name ?? "Usuário"}
      </h1>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A9B8E8] text-sm font-semibold text-white">
        {user?.name.charAt(0).toUpperCase() ?? "U"}
      </div>
    </header>
  );
}

export default HomeHeader;