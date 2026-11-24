import { NavLink } from "react-router";
import AppIcon from "../common/AppIcon";

function BottomNavigation() {
  const navigationItems = [
    {
      to: "/",
      label: "Home",
      icon: "House",
      end: true,
    },
    {
      to: "/rapidos",
      label: "Frases",
      icon: "MessageCircle",
      end: false,
    },
    {
      to: "/agenda",
      label: "Rotina",
      icon: "CalendarDays",
      end: false,
    },
    {
      to: "/perfil",
      label: "Perfil",
      icon: "UserRound",
      end: false,
    },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-app-border bg-white px-2 py-3 shadow-[0_-3px_12px_rgba(41,37,36,0.06)]"
    >
      {navigationItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center gap-1 px-1 transition-colors ${
              isActive ? "font-bold text-brand-primary" : "text-gray-500"
            }`
          }
        >
          <AppIcon name={item.icon} size={36} />

          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}

      <NavLink
        to="/emergencia"
        aria-label="Comunicação de emergência"
        className={({ isActive }) =>
          `flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary shadow-md transition-transform active:scale-95 ${
            isActive ? "ring-4 ring-orange-200" : ""
          }`
        }
      >
        <AppIcon name="Siren" size={44} />

        <span className="sr-only">SOS</span>
      </NavLink>

      {navigationItems.slice(2).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center gap-1 px-1 transition-colors ${
              isActive ? "font-bold text-brand-primary" : "text-gray-500"
            }`
          }
        >
          <AppIcon name={item.icon} size={36} />

          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavigation;
