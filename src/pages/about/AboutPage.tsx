import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Crown,
  MessageCircleHeart,
} from "lucide-react";
import { useNavigate } from "react-router";

interface TeamMember {
  name: string;
  role: string;
  github: string | null;
  isLead?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    name: "Arthur Mota",
    role: "Tech Lead & Developer",
    github: "https://github.com/arthur-rmota",
    isLead: true,
  },
  {
    name: "Filipe Hannisch",
    role: "",
    github: "https://github.com/FHannisch",
  },
  {
    name: "Paulo César",
    role: "",
    github: "https://github.com/paulodicesar-jpg",
  },
  {
    name: "Rebeca Alencar",
    role: "",
    github: "https://github.com/becalencar",
  },
  {
    name: "Rebeca Macedo",
    role: "",
    github: "https://github.com/rebecacore",
  },
  {
    name: "V. Merlino",
    role: "",
    github: "https://github.com/VitoriaMerlino",
  },
];

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
            Comuni
            <span className="text-brand-primary">CA</span>
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
            <div className="px-4 pb-4 pt-5">
              <h3 className="text-base font-bold text-[#42251D]">
                Equipe de desenvolvimento
              </h3>

              <p className="mt-1 text-sm text-[#80685D]">
                Pessoas responsáveis pela criação do ComuniCA.
              </p>
            </div>

            <div className="divide-y divide-[#F1E4D9]">
              {teamMembers.map((member) => {
                const rowClassName = [
                  "relative flex min-h-[72px] w-full items-center",
                  "gap-3 px-4 py-3 text-left",
                  member.isLead ? "bg-[#FFFAF6]" : "bg-white",
                  member.github
                    ? "transition-colors hover:bg-[#FFF4EA] active:bg-[#FFEDE0] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
                    : "",
                ].join(" ");

                const rowContent = (
                  <>
                    {member.isLead && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-brand-primary"
                      />
                    )}

                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECE5] text-[#805E4D]"
                    >
                      {member.isLead ? (
                        <Crown size={22} strokeWidth={2.1} />
                      ) : (
                        <Code2 size={22} strokeWidth={2.1} />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-bold ${
                          member.isLead
                            ? "text-brand-primary"
                            : "text-[#42251D]"
                        }`}
                      >
                        {member.name}
                      </span>

                      <span className="mt-0.5 block text-sm text-[#80685D]">
                        {member.role}
                      </span>
                    </span>

                    {member.github && (
                      <ExternalLink
                        size={18}
                        className="shrink-0 text-[#A58B7C]"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                return member.github ? (
                  <a
                    key={member.name}
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClassName}
                    aria-label={`Abrir GitHub de ${member.name} em nova aba`}
                  >
                    {rowContent}
                  </a>
                ) : (
                  <div key={member.name} className={rowClassName}>
                    {rowContent}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#F1E4D9]">
              <a
                href="https://github.com/arthur-rmota/ComuniCA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[76px] w-full items-center gap-3 bg-[#FCFAF8] px-4 py-3 transition-colors hover:bg-[#FFF4EA] active:bg-[#FFEDE0] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
                aria-label="Abrir repositório do ComuniCA no GitHub em nova aba"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECE5] text-[#805E4D]"
                >
                  <Code2 size={22} strokeWidth={2.1} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-[#42251D]">
                    Repositório do projeto
                  </span>

                  <span className="mt-0.5 block text-sm text-[#80685D]">
                    ComuniCA no GitHub
                  </span>
                </span>

                <ExternalLink
                  size={18}
                  className="shrink-0 text-[#A58B7C]"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
