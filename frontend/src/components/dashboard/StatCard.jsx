function StatCard({ title, value, unit, description, icon, status }) {
  const iconStyle =
    status === "success"
      ? "bg-[#e6f8f1] text-[#18a673]"
      : status === "warning"
      ? "bg-[#fff4dc] text-[#e99a00]"
      : "bg-[#e8f6fc] text-[#1597d4]";

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-lg p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#667085]">
            {title}
          </p>

          <div className="mt-2 text-3xl font-bold text-[#172033]">
            {value}
            {unit && (
              <span className="ml-1 text-lg font-semibold text-[#667085]">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-[#98a2b3]">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;