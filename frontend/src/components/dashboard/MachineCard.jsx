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
    <div className="min-h-[245px] rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      {/* Machine Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-[#172033]">
            {name}
          </h3>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            {machineCode} <span className="mx-1">·</span> {type}
          </p>
        </div>

        <div
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${currentStatus.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`} />

          {status}
        </div>
      </div>

      {/* Health */}
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#667085]">
            Machine Health
          </span>

          <span className="text-[13px] font-bold text-[#172033]">
            {health}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1f4]">
          <div
            className="h-full rounded-full bg-[#18a673]"
            style={{ width: `${health}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-7 grid grid-cols-3 border-t border-[#e4e7ec] pt-5">
        <div className="border-r border-[#e4e7ec] pr-3">
          <p className="text-[11px] text-[#98a2b3]">Temperature</p>

          <p className="mt-1.5 text-[14px] font-semibold text-[#172033]">
            {temperature}°C
          </p>
        </div>

        <div className="border-r border-[#e4e7ec] px-3">
          <p className="text-[11px] text-[#98a2b3]">Vibration</p>

          <p className="mt-1.5 text-[14px] font-semibold text-[#172033]">
            {vibration} mm/s
          </p>
        </div>

        <div className="pl-3">
          <p className="text-[11px] text-[#98a2b3]">Power</p>

          <p className="mt-1.5 text-[14px] font-semibold text-[#172033]">
            {power} kW
          </p>
        </div>
      </div>
    </div>
  );
}

export default MachineCard;
