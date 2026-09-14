function Sidebar({ isOpen, onToggle }) {
  const navItems = [
    ["▦", "Dashboard"],
    ["◫", "Machines"],
    ["⌁", "Live Data"],
    ["⚠", "Anomaly Detection"],
    ["◒", "Energy & CO₂"],
    ["◷", "Simulation"],
    ["▤", "Reports"],
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onToggle}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[250px] shrink-0 flex-col
          bg-[#172033]
          shadow-xl
          transition-transform duration-300 ease-in-out
          lg:relative lg:z-auto lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-[82px] shrink-0 items-center gap-3 border-b border-white/[0.08] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1597d4] text-xl font-bold text-white">
            E
          </div>

          <div className="flex-1">
            <h2 className="text-[19px] font-bold leading-none text-white">
              EcoTwin
            </h2>

            <span className="mt-1.5 block text-[8px] font-semibold tracking-[0.13em] text-white/45">
              FACTORY DIGITAL TWIN
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-white/60 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1.5">
            {navItems.map(([icon, label], index) => (
              <button
                key={label}
                type="button"
                className={`flex h-11 w-full items-center gap-3 rounded-lg px-4 text-[13px] font-medium transition ${
                  index === 0
                    ? "bg-[#1597d4] text-white"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="flex w-5 justify-center text-base">
                  {icon}
                </span>

                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Factory */}
        <div className="mx-4 mb-5 flex shrink-0 items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#18a673]" />

          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[12px] font-semibold text-white">
              Demo Factory
            </strong>

            <small className="mt-0.5 block text-[11px] text-white/40">
              Jalgaon
            </small>
          </div>

          {/* Bottom Close Button */}
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
            className="text-lg text-white/35 transition hover:text-white"
          >
            ›
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;