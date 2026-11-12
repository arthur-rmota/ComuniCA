function DailyMessage() {
  const hour = new Date().getHours();

  let greeting = 'Boa noite!';
  let emoji = '🌙';

  if (hour >= 5 && hour < 12) {
    greeting = 'Bom dia!';
    emoji = '☀️';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Boa tarde!';
    emoji = '🌤️';
  }

  return (
    <section className="flex items-center justify-between rounded-xl bg-[#F1B5BD] px-4 py-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-app-text">
          {greeting}
        </h2>

        <span className="text-2xl">{emoji}</span>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        <span className="text-lg text-black">▶</span>
      </div>
    </section>
  );
}

export default DailyMessage;