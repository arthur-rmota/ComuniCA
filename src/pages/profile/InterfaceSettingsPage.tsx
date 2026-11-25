
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Grid2X2,
  Type,
  Image,
} from "lucide-react";

import {
  useInterface,
  type InterfaceSize,
} from "../../contexts/InterfaceContext";

const sizeOptions: InterfaceSize[] = [
  "small",
  "medium",
  "large",
  "extra-large",
];

const sizeLabels: Record<InterfaceSize, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  "extra-large": "Muito grande",
};

interface SizeControlProps {
  title: string;
  description: string;
  value: InterfaceSize;
  icon: typeof Grid2X2;
  onChange: (size: InterfaceSize) => void;
}

function SizeControl({
  title,
  description,
  value,
  icon: Icon,
  onChange,
}: SizeControlProps) {
  const currentIndex = sizeOptions.indexOf(value);

  function decreaseSize() {
    if (currentIndex > 0) {
      const newSize = sizeOptions[currentIndex - 1];

      if (newSize != undefined) {
        onChange(newSize);
      }
    }
  }

  function increaseSize() {
    if (currentIndex < sizeOptions.length - 1) {
      const newSize = sizeOptions[currentIndex + 1];

      if (newSize != undefined) {
        onChange(newSize);
      }
    }
  }

  return (
    <section className="rounded-2xl border border-[#F1E4D9] bg-white p-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFE0BD] text-brand-primary">
          <Icon size={23} strokeWidth={2.2} />
        </span>

        <div className="min-w-0">
          <h2 className="font-extrabold text-[#42251D]">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-[#80685D]">
            {description}
          </p>
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-3"
        role="group"
        aria-label={`Ajustar ${title.toLowerCase()}`}
      >
        <button
          type="button"
          onClick={decreaseSize}
          disabled={currentIndex === 0}
          aria-label={`Diminuir ${title.toLowerCase()}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F1E4D9] text-[#42251D] transition-colors hover:bg-[#FFF1E4] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={21} />
        </button>

        <div className="flex-1 text-center">
          <span
            aria-live="polite"
            className="font-bold text-brand-primary"
          >
            {sizeLabels[value]}
          </span>

          <div className="mt-2 flex justify-center gap-1.5">
            {sizeOptions.map((option, index) => (
              <span
                key={option}
                className={`h-1.5 w-7 rounded-full ${
                  index <= currentIndex
                    ? "bg-brand-primary"
                    : "bg-[#F1E4D9]"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={increaseSize}
          disabled={currentIndex === sizeOptions.length - 1}
          aria-label={`Aumentar ${title.toLowerCase()}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F1E4D9] text-[#42251D] transition-colors hover:bg-[#FFF1E4] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={21} />
        </button>
      </div>
    </section>
  );
}

function InterfaceSettingsPage() {
  const navigate = useNavigate();

  const {
    settings,
    setCardSize,
    setTextSize,
    setSymbolSize,
    resetSettings,
  } = useInterface();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/perfil")}
              aria-label="Voltar para o perfil"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm"
            >
              <ArrowLeft size={24} />
            </button>

            <h1 className="px-14 text-center text-2xl font-extrabold text-[#42251D]">
              Gerenciar interface
            </h1>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-brand-primary">
              <SlidersHorizontal size={25} />
            </span>

            <div>
              <p className="font-extrabold text-[#42251D]">
                Personalize sua experiência
              </p>

              <p className="mt-1 text-sm text-[#775A49]">
                Ajuste os elementos visuais de acordo com suas necessidades.
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <SizeControl
            title="Tamanho dos cartões"
            description="Ajuste a dimensão dos cartões de comunicação e categorias."
            value={settings.cardSize}
            icon={Grid2X2}
            onChange={setCardSize}
          />

          <SizeControl
            title="Tamanho dos textos"
            description="Ajuste o tamanho das palavras e frases."
            value={settings.textSize}
            icon={Type}
            onChange={setTextSize}
          />

          <SizeControl
            title="Tamanho dos símbolos"
            description="Ajuste o tamanho das imagens e dos ícones."
            value={settings.symbolSize}
            icon={Image}
            onChange={setSymbolSize}
          />

          <div className="mt-2 rounded-2xl border border-[#F1E4D9] bg-white p-4">
            <div className="mb-3">
              <h2 className="font-extrabold text-[#42251D]">
                Restaurar configurações
              </h2>

              <p className="mt-1 text-sm text-[#80685D]">
                Volte aos tamanhos originais do ComuniCA.
              </p>
            </div>

            <button
              type="button"
              onClick={resetSettings}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E9D8CA] px-4 py-3 font-bold text-[#9A3412] transition-colors hover:bg-[#FFF1E4]"
            >
              <RotateCcw size={18} />
              Restaurar padrões
            </button>
          </div>

          <p className="px-2 text-center text-xs leading-relaxed text-[#80685D]">
            Suas alterações são aplicadas automaticamente e ficam salvas neste navegador.
          </p>
        </div>
      </div>
    </main>
  );
}

export default InterfaceSettingsPage;
