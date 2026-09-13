function MachineCard({
  name,
  machineCode,
  type,
  status,
  health,
  temperature,
  vibration,
  power,
}) {
  const statusConfig = {
    RUNNING: {
      dot: "bg-[#18a673]",
      badge: "bg-[#e6f8f1] text-[#18a673]",
    },
    WARNING: {
      dot: "bg-[#e99a00]",
      badge: "bg-[#fff4dc] text-[#e99a00]",
    },
    IDLE: {
      dot: "bg-[#98a2b3]",
      badge: "bg-[#f2f4f7] text-[#667085]",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.IDLE;

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-lg p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#172033]">
            {name}
          </h3>

          <span className="mt-1 block text-xs text-[#98a2b3]">
            {machineCode} · {type}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
          ></span>

          {status}
        </div>
      </div>

      {/* Health */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#667085]">
            Machine Health
          </span>

          <strong className="text-sm font-semibold text-[#172033]">
            {health}%
          </strong>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f4]">
          <div
            className="h-full rounded-full bg-[#18a673] transition-all duration-500"
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-3 divide-x divide-[#e4e7ec]">
        <div className="pr-3">
          <span className="block text-[11px] text-[#98a2b3]">
            Temperature
          </span>
          <strong className="mt-1 block text-sm font-semibold text-[#172033]">
            {temperature}°C
          </strong>
        </div>

        <div className="px-3">
          <span className="block text-[11px] text-[#98a2b3]">
            Vibration
          </span>
          <strong className="mt-1 block text-sm font-semibold text-[#172033]">
            {vibration} mm/s
          </strong>
        </div>

        <div className="pl-3">
          <span className="block text-[11px] text-[#98a2b3]">
            Power
          </span>
          <strong className="mt-1 block text-sm font-semibold text-[#172033]">
            {power} kW
          </strong>
        </div>
      </div>
    </div>
  );
}

export default MachineCard;