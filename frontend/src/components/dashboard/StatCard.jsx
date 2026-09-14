function StatCard({ title, value, unit, description, icon, status }) {
  const iconStyle =
    status === "success"
      ? "bg-[#e6f8f1] text-[#18a673]"
      : status === "warning"
      ? "bg-[#fff4dc] text-[#e99a00]"
      : "bg-[#e8f6fc] text-[#1597d4]";

  return (
    <div className="min-h-[148px] rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#667085]">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-[30px] font-bold leading-none text-[#172033]">
              {value}
            </span>

            {unit && (
              <span className="text-base font-semibold text-[#667085]">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      {description && (
        <p className="mt-5 text-[12px] text-[#98a2b3]">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;