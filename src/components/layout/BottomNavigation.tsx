
import { NavLink } from "react-router";
import {
  House,
  MessageCircle,
  Siren,
  CalendarDays,
  UserRound,
} from "lucide-react";

function BottomNavigation() {
  const navigationItems = [
    { to: "/", label: "Home", icon: House, end: true },
    {
      to: "/rapidos",
      label: "Frases",
      icon: MessageCircle,
      end: false,
    },
    {
      to: "/agenda",
      label: "Agenda",
      icon: CalendarDays,
      end: false,
    },
    {
      to: "/perfil",
      label: "Perfil",
      icon: UserRound,
      end: false,
    },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-app-border bg-white px-2 py-3 shadow-[0_-3px_12px_rgba(41,37,36,0.06)]"
    >
      {navigationItems.slice(0, 2).map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center gap-1 px-1 ${
                isActive
                  ? "font-bold text-brand-primary"
                  : "text-gray-500"
              }`
            }
          >
            <Icon size={23} aria-hidden="true" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        );
      })}

      <NavLink
        to="/emergencia"
        aria-label="Comunicação de emergência"
        className={({ isActive }) =>
          `flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition-transform active:scale-95 ${
            isActive ? "ring-4 ring-orange-200" : ""
          }`
        }
      >
        <Siren size={28} strokeWidth={2.5} aria-hidden="true" />
        <span className="sr-only">SOS</span>
      </NavLink>

      {navigationItems.slice(2).map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center gap-1 px-1 ${
                isActive
                  ? "font-bold text-brand-primary"
                  : "text-gray-500"
              }`
            }
          >
            <Icon size={23} aria-hidden="true" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
