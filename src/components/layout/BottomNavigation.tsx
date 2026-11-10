import { NavLink } from "react-router";

function BottomNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 flex w-full items-center justify-around bg-[#E5E5E5] px-3 py-3"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "font-bold text-[#383838]" : "text-gray-500"
          }`
        }
      >
        <span className="text-xl">🏠</span>
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink
        to="/rapidos"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "font-bold text-[#383838]" : "text-gray-500"
          }`
        }
      >
        <span className="text-xl">⚡</span>
        <span className="text-xs">Rápidos</span>
      </NavLink>

      <NavLink
        to="/favoritos"
        aria-label="Frases rápidas favoritas"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFA726] text-3xl text-white shadow-md"
      >
        ★
      </NavLink>

      <NavLink
        to="/agenda"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "font-bold text-[#383838]" : "text-gray-500"
          }`
        }
      >
        <span className="text-xl">📅</span>
        <span className="text-xs">Agenda</span>
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "font-bold text-[#383838]" : "text-gray-500"
          }`
        }
      >
        <span className="text-xl">👤</span>
        <span className="text-xs">Perfil</span>
      </NavLink>
    </nav>
  );
}

export default BottomNavigation;
