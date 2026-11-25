import { Link } from "react-router";
import AppIcon from "../../components/common/AppIcon";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-8 md:px-6 lg:landscape:pb-8 xl:px-8 xl:pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full bg-[#FFF0BB]/40"
      />

      <div className="relative mx-auto w-full max-w-lg md:max-w-xl">
        <header className="mb-6 text-center">
          <img
            src={`${import.meta.env.BASE_URL}comunica-dark-icon.png`}
            alt="ComuniCA"
            className="mx-auto h-20 w-20 object-contain"
          />
        </header>

        <section
          aria-labelledby="not-found-title"
          className="rounded-3xl border border-[#F5E9DF] bg-white p-6 text-center shadow-[0_5px_14px_rgba(41,37,36,0.06)] sm:p-8"
        >
          <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-[#FFF0E4]">
            <AppIcon name="CircleHelp" size={104} />
          </div>

          <p className="text-7xl font-black tracking-tight text-brand-primary">
            404
          </p>

          <h1
            id="not-found-title"
            className="mt-3 text-2xl font-extrabold text-[#42251D]"
          >
            Página não encontrada
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-[#775F54]">
            Não conseguimos encontrar a página que você procura. Que tal voltar
            ao início?
          </p>

          <Link
            to="/"
            replace
            className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-brand-primary px-4 py-3 font-bold text-white shadow-sm transition-all hover:bg-brand-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
          >
            <AppIcon name="House" size={32} />

            <span>Voltar ao início</span>
          </Link>
        </section>

        <footer className="mt-6 text-center">
          <p className="text-sm font-semibold text-[#80685D]">
            ComuniCA • Comunicação sem barreiras
          </p>
        </footer>
      </div>
    </main>
  );
}
