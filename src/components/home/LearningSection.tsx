function LearningSection() {
  return (
    <section className="mt-3">
      <h2 className="mb-2 text-sm font-semibold text-app-text">
        Aprendizado
      </h2>

      <div className="flex gap-3">
        <div className="flex min-h-[190px] flex-1 flex-col items-center justify-between rounded-xl bg-[#F5D16A] p-3 text-center">
          <div>
            <p className="text-xs text-app-text">
              Que tal começar o dia
            </p>

            <h3 className="text-2xl font-bold text-app-text">
              aprendendo?
            </h3>
          </div>

          <div className="text-5xl">
            ☀️
          </div>

          <p className="text-xs font-medium text-app-text">
            Descubra algo novo!
          </p>
        </div>

        <button className="w-14 rounded-xl bg-[#BDB0B0] text-sm font-semibold text-app-text [writing-mode:vertical-rl] rotate-180">
          Ver mais
        </button>
      </div>
    </section>
  );
}

export default LearningSection;