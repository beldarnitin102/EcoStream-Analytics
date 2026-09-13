function Sidebar() {
  return (
    <aside className="hidden w-[250px] shrink-0 flex-col bg-[#172033] lg:flex">
      {/* Logo */}
      <div className="flex h-[68px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1597d4] text-lg font-bold text-white">
          E
        </div>

        <div>
          <h2 className="text-lg font-bold leading-none text-white">
            EcoTwin
          </h2>

          <span className="mt-1 block text-[8px] font-medium tracking-[0.12em] text-white/50">
            FACTORY DIGITAL TWIN
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <button className="flex w-full items-center gap-3 rounded-lg bg-[#1597d4] px-3 py-2.5 text-sm font-medium text-white">
          <span>▦</span>
          Dashboard
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>◫</span>
          Machines
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>⌁</span>
          Live Data
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>⚠</span>
          Anomaly Detection
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>◒</span>
          Energy & CO₂
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>◷</span>
          Simulation
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white">
          <span>▤</span>
          Reports
        </button>
      </nav>

      {/* Factory */}
      <div className="mx-3 mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3">
        <span className="h-2 w-2 rounded-full bg-[#18a673]"></span>

        <div className="min-w-0 flex-1">
          <strong className="block truncate text-xs font-semibold text-white">
            Demo Factory
          </strong>

          <small className="text-[11px] text-white/45">
            Jalgaon
          </small>
        </div>

        <span className="text-lg text-white/40">›</span>
      </div>
    </aside>
  );
}

export default Sidebar;