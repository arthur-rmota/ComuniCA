function BottomNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 flex w-full items-center justify-around bg-[#E5E5E5] px-3 py-3"
    >
      <button type="button" className="flex flex-col items-center gap-1">
        <span className="text-xl">🏠</span>
        <span className="text-xs">Home</span>
      </button>

      <button type="button" className="flex flex-col items-center gap-1">
        <span className="text-xl">⚡</span>
        <span className="text-xs">Rápidos</span>
      </button>

      <button
        type="button"
        aria-label="Criar cartão"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFA726] text-3xl shadow-md"
      >
        +
      </button>

      <button type="button" className="flex flex-col items-center gap-1">
        <span className="text-xl">📅</span>
        <span className="text-xs">Agenda</span>
      </button>

      <button type="button" className="flex flex-col items-center gap-1">
        <span className="text-xl">👤</span>
        <span className="text-xs">Perfil</span>
      </button>
    </nav>
  );
}

export default BottomNavigation;