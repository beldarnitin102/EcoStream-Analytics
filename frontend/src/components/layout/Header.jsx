function Header() {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#e4e7ec] bg-white px-5 sm:px-6 lg:px-7">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#98a2b3]">Main Hub</span>
        <span className="text-[#98a2b3]">›</span>
        <strong className="font-semibold text-[#172033]">
          Factory Dashboard
        </strong>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-3 py-2 sm:flex">
          <span className="text-lg text-[#98a2b3]">⌕</span>

          <input
            type="text"
            placeholder="Search metrics..."
            className="w-40 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#98a2b3]"
          />
        </div>

        {/* Notification */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4e7ec] bg-white text-[#667085] transition hover:bg-[#f9fafb]">
          ♧
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f6fc] text-sm font-semibold text-[#0877ad]">
            N
          </div>

          <div className="hidden sm:block">
            <strong className="block text-sm font-semibold text-[#172033]">
              Nitin
            </strong>

            <small className="block text-[10px] font-medium tracking-wide text-[#98a2b3]">
              ADMIN
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;