import {
  ArrowLeft,
  ExternalLink,
  Code2,
  MessageCircleHeart,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={() => navigate("/perfil")}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-app-text">
          Sobre o ComuniCA
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-app-background">
            <MessageCircleHeart
              size={44}
              className="text-brand-primary"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-app-text">ComuniCA</h2>

          <p className="mt-1 text-sm font-medium text-brand-primary">
            Comunicação Aumentativa e Alternativa
          </p>

          <p className="mt-5 text-sm leading-relaxed text-app-muted">
            O ComuniCA é um aplicativo em desenvolvimento que busca facilitar a
            comunicação de crianças com dificuldades na fala por meio de
            símbolos, palavras e reprodução de voz. Seu objetivo é tornar a
            comunicação mais simples, acessível e personalizada, atendendo às
            necessidades de cada usuário.
          </p>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="mb-3 px-3 text-lg font-medium text-app-muted">
          Desenvolvimento
        </h2>

        <div className="overflow-hidden rounded-2xl bg-white">
          <a
            href="https://github.com/arthur-rmota"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 items-center gap-3 p-4 transition-colors hover:bg-stone-50"
          >
            <Code2 size={24} className="shrink-0 text-app-text" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-app-text">Arthur Mota</p>
              <p className="text-sm text-app-muted">Perfil do desenvolvedor</p>
            </div>

            <ExternalLink size={18} className="shrink-0 text-app-muted" />
          </a>

          <div className="mx-4 h-px bg-app-background" />

          <a
            href="https://github.com/arthur-rmota/ComuniCA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 items-center gap-3 p-4 transition-colors hover:bg-stone-50"
          >
            <Code2 size={24} className="shrink-0 text-app-text" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-app-text">
                Repositório do projeto
              </p>
              <p className="text-sm text-app-muted">ComuniCA no GitHub</p>
            </div>

            <ExternalLink size={18} className="shrink-0 text-app-muted" />
          </a>
        </div>
      </section>
    </main>
  );
}
