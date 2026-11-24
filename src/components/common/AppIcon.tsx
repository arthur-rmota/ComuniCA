import manifest from "../../constants/aacIconsManifest.json";

interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

const iconAliases: Record<string, string> = {
  balloons: "balloon",
  phonecall: "phone",
  calendarcheck: "calendarcheck2",
  music2: "music",
  micvocal: "music",
  toybrick: "puzzle",
  snowflake: "thermometer",
};

const iconPaths = new Map<string, string>(
  Object.entries({
    ...manifest.icons,
    ...manifest.extras,
  }).map(([name, path]) => [normalizeName(name), path]),
);

function AppIcon({ name, size = 48, className = "", alt = "" }: AppIconProps) {
  const normalizedName = normalizeName(name);

  const resolvedName = iconAliases[normalizedName] ?? normalizedName;

  const path = iconPaths.get(resolvedName) ?? manifest.icons.Folder;

  return (
    <img
      src={`${import.meta.env.BASE_URL}aac-icons/${path}`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 object-contain select-none ${className}`}
    />
  );
}

export default AppIcon;
