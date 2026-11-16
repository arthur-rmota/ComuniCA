import { ArrowLeft, Code2, ExternalLink, MessageCircleHeart } from "lucide-react";
import { useNavigate } from "react-router";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-96 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/perfil")}
              aria-label="Voltar para o perfil"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              Sobre o ComuniCA
            </h1>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-[#F5E9DF] bg-white p-6 text-center shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#FFF7F0] p-3">
            <img
              src="/comunica2-icon.png"
              alt="Logo do ComuniCA"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#592B1D]">
            Comuni<span className="text-brand-primary">CA</span>
          </h2>

          <div className="mx-auto mt-3 inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-[#FFF0E4] px-4 py-2 text-center text-xs font-bold text-[#9A3412]">
            <MessageCircleHeart
              size={18}
              className="shrink-0"
              aria-hidden="true"
            />
            <span>Comunicação Aumentativa e Alternativa</span>
          </div>

          <p className="mt-5 text-center text-sm leading-7 text-[#775F54]">
            O ComuniCA é um aplicativo em desenvolvimento que busca facilitar a
            comunicação de crianças com dificuldades na fala por meio de
            símbolos, palavras e reprodução de voz. Seu objetivo é tornar a
            comunicação mais simples, acessível e personalizada, atendendo às
            necessidades de cada usuário.
          </p>
        </section>

        <section className="mt-7" aria-labelledby="about-development-title">
          <div className="mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFE0BD] text-brand-primary"
            >
              <Code2 size={24} strokeWidth={2.3} />
            </span>
            <h2
              id="about-development-title"
              className="text-xl font-extrabold text-[#42251D]"
            >
              Desenvolvimento
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#F5E9DF] bg-white shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
            <a
              href="https://github.com/arthur-rmota"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 items-center gap-3 px-4 py-4 transition-colors hover:bg-[#FFF9F3] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
              aria-label="Abrir perfil do desenvolvedor Arthur Mota no GitHub (nova aba)"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDEFE3] text-[#347854]"
              >
                <Code2 size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#42251D]">
                  Arthur Mota
                </span>
                <span className="mt-1 block text-sm text-[#80685D]">
                  Perfil do desenvolvedor
                </span>
              </span>
              <ExternalLink
                size={20}
                className="shrink-0 text-[#9A6F5B]"
                aria-hidden="true"
              />
            </a>

            <div className="mx-4 h-px bg-[#F1E4D9]" />

            <a
              href="https://github.com/arthur-rmota/ComuniCA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-20 items-center gap-3 px-4 py-4 transition-colors hover:bg-[#FFF9F3] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
              aria-label="Abrir repositório do ComuniCA no GitHub (nova aba)"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EBE1FA] text-[#7752A4]"
              >
                <Code2 size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-[#42251D]">
                  Repositório do projeto
                </span>
                <span className="mt-1 block text-sm text-[#80685D]">
                  ComuniCA no GitHub
                </span>
              </span>
              <ExternalLink
                size={20}
                className="shrink-0 text-[#9A6F5B]"
                aria-hidden="true"
              />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
