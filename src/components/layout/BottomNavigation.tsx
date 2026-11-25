import { NavLink } from "react-router";
import AppIcon from "../common/AppIcon";

const navigationItems = [
  {
    to: "/",
    label: "Home",
    desktopLabel: "Início",
    icon: "House",
    end: true,
  },
  {
    to: "/rapidos",
    label: "Frases",
    desktopLabel: "Frases rápidas",
    icon: "MessageCircle",
    end: false,
  },
  {
    to: "/agenda",
    label: "Rotina",
    desktopLabel: "Minha rotina",
    icon: "CalendarDays",
    end: false,
  },
  {
    to: "/perfil",
    label: "Perfil",
    desktopLabel: "Meu perfil",
    icon: "UserRound",
    end: false,
  },
] as const;

type NavigationItem = (typeof navigationItems)[number];

interface NavigationLinkProps {
  item: NavigationItem;
  desktop?: boolean;
}

function NavigationLink({ item, desktop = false }: NavigationLinkProps) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        desktop
          ? `flex min-h-16 items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
              isActive
                ? "bg-orange-50 font-extrabold text-brand-primary"
                : "font-semibold text-gray-600 hover:bg-orange-50"
            }`
          : `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 transition-colors ${
              isActive ? "font-bold text-brand-primary" : "text-gray-500"
            }`
      }
    >
      <div className="shrink-0">
        <AppIcon name={item.icon} size={36} />
      </div>

      <span className={desktop ? "text-sm" : "app-navigation-label text-xs"}>
        {desktop ? item.desktopLabel : item.label}
      </span>
    </NavLink>
  );
}

function EmergencyNavigationLink({ desktop = false }: { desktop?: boolean }) {
  return (
    <NavLink
      to="/emergencia"
      aria-label="Comunicação de emergência"
      className={({ isActive }) =>
        `${
          desktop
            ? "flex min-h-16 w-full shrink-0 items-center justify-center gap-3 rounded-2xl px-4 py-3"
            : "app-navigation-sos flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        } bg-brand-primary text-white shadow-md transition-transform active:scale-95 ${
          isActive ? "ring-4 ring-orange-200" : ""
        }`
      }
    >
      <AppIcon name="Siren" size={desktop ? 48 : 44} />

      <span className={desktop ? "text-lg font-extrabold" : "sr-only"}>
        SOS
      </span>
    </NavLink>
  );
}

function BottomNavigation() {
  return (
    <>
      {/* Celulares e tablets */}

      <nav
        aria-label="Navegação principal"
        className="app-navigation fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-app-border bg-white px-2 py-3 shadow-[0_-3px_12px_rgba(41,37,36,0.06)]"
      >
        {navigationItems.slice(0, 2).map((item) => (
          <NavigationLink key={item.to} item={item} />
        ))}

        <EmergencyNavigationLink />

        {navigationItems.slice(2).map((item) => (
          <NavigationLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Desktop */}

      <nav aria-label="Navegação principal" className="app-navigation-desktop">
        <header className="mb-6 border-b border-app-border pb-6">
          <NavLink
            to="/"
            aria-label="ComuniCA — Página inicial"
            className="flex items-center justify-center gap-2"
          >
            <img
              src={`${import.meta.env.BASE_URL}comunica-dark-icon.png`}
              alt=""
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-black tracking-tight text-[#42251D]">
              Comuni
              <span className="text-brand-primary">CA</span>
            </span>
          </NavLink>
        </header>

        <div className="flex flex-col gap-2">
          {navigationItems.map((item) => (
            <NavigationLink key={item.to} item={item} desktop />
          ))}
        </div>

        <div className="mt-auto pt-8">
          <EmergencyNavigationLink desktop />
        </div>
      </nav>
    </>
  );
}

export default BottomNavigation;
