function Header({ onMainHubClick }) {
  return (
    <header className="flex h-[68px] w-full items-center justify-between border-b border-[#e4e7ec] bg-white px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onMainHubClick}
          className="text-[#667085] transition hover:text-[#1597d4]"
        >
          Main Hub
        </button>

        <span className="text-[#98a2b3]">›</span>

        <span className="font-semibold text-[#172033]">
          Factory Dashboard
        </span>
      </div>

      {/* Header Actions */}
      <div className="ml-6 flex shrink-0 items-center gap-4">
        
        {/* Search */}
        <div className="flex h-10 w-[180px] items-center gap-2 rounded-lg border border-[#e4e7ec] bg-white px-3">
          <span className="text-base text-[#98a2b3]">⌕</span>

          <input
            type="text"
            placeholder="Search metrics..."
            className="min-w-0 flex-1 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#98a2b3]"
          />
        </div>

        {/* Notification */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e4e7ec] bg-white text-sm text-[#667085] transition hover:bg-[#f9fafb]"
        >
          ♧
        </button>

        {/* Profile */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f6fc] text-sm font-semibold text-[#0877ad]">
            N
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#172033]">
              Nitin
            </p>

            <p className="mt-1 text-[10px] font-medium tracking-wide text-[#98a2b3]">
              ADMIN
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;