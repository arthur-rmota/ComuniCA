
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type InterfaceSize =
  | "small"
  | "medium"
  | "large"
  | "extra-large";

interface InterfaceSettings {
  cardSize: InterfaceSize;
  textSize: InterfaceSize;
  symbolSize: InterfaceSize;
}

const defaultSettings: InterfaceSettings = {
  cardSize: "medium",
  textSize: "medium",
  symbolSize: "medium",
};

const STORAGE_KEY = "comunica-interface-settings";

interface InterfaceContextValue {
  settings: InterfaceSettings;
  setCardSize: (size: InterfaceSize) => void;
  setTextSize: (size: InterfaceSize) => void;
  setSymbolSize: (size: InterfaceSize) => void;
  resetSettings: () => void;
}

const InterfaceContext =
  createContext<InterfaceContextValue | undefined>(undefined);

function loadSettings(): InterfaceSettings {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return defaultSettings;
    }

    const parsed = JSON.parse(savedSettings) as Partial<InterfaceSettings>;

    const validSizes: InterfaceSize[] = [
      "small",
      "medium",
      "large",
      "extra-large",
    ];

    return {
      cardSize: validSizes.includes(parsed.cardSize as InterfaceSize)
        ? parsed.cardSize as InterfaceSize
        : defaultSettings.cardSize,

      textSize: validSizes.includes(parsed.textSize as InterfaceSize)
        ? parsed.textSize as InterfaceSize
        : defaultSettings.textSize,

      symbolSize: validSizes.includes(parsed.symbolSize as InterfaceSize)
        ? parsed.symbolSize as InterfaceSize
        : defaultSettings.symbolSize,
    };
  } catch {
    return defaultSettings;
  }
}

export function InterfaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<InterfaceSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar preferências de interface:", error);
    }
  }, [settings]);

  function setCardSize(size: InterfaceSize) {
    setSettings((current) => ({
      ...current,
      cardSize: size,
    }));
  }

  function setTextSize(size: InterfaceSize) {
    setSettings((current) => ({
      ...current,
      textSize: size,
    }));
  }

  function setSymbolSize(size: InterfaceSize) {
    setSettings((current) => ({
      ...current,
      symbolSize: size,
    }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  return (
    <InterfaceContext.Provider
      value={{
        settings,
        setCardSize,
        setTextSize,
        setSymbolSize,
        resetSettings,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
}

export function useInterface() {
  const context = useContext(InterfaceContext);

  if (!context) {
    throw new Error(
      "useInterface deve ser utilizado dentro de InterfaceProvider.",
    );
  }

  return context;
}
