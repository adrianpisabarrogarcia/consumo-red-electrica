interface HeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 transition-colors duration-500 bg-white/90 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="pi pi-bolt text-white text-base animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Consumo Red Eléctrica
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                PVPC España 🇪🇸
              </span>
            </h1>
          </div>
        </div>

        {/* Right Side: Animated Premium Theme Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden xs:inline uppercase tracking-wider">
            {theme === "dark" ? "Modo Oscuro" : "Modo Claro"}
          </span>
          <div
            onClick={toggleTheme}
            className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-950/40 border border-slate-300 dark:border-slate-800/60 relative cursor-pointer transition-all duration-300 shadow-inner flex items-center hover:scale-105 active:scale-95 hover:border-slate-400 dark:hover:border-slate-700"
            title="Alternar tema"
            aria-label="Alternar tema"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleTheme();
              }
            }}
          >
            {/* Animated Slider Circle */}
            <div
              className={`w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 absolute top-[3px] flex items-center justify-center transition-all duration-300 transform shadow-md ${
                theme === "dark" ? "left-[30px]" : "left-[4px]"
              }`}
            >
              {theme === "dark" ? (
                <span className="pi pi-moon text-indigo-100 text-xs animate-pulse"></span>
              ) : (
                <span className="pi pi-sun text-amber-100 text-xs animate-spin-slow"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
