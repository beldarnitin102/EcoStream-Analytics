function MachineCard({
  name,
  machineCode,
  type,
  status,
  health,
  temperature,
  vibration,
  power
}) {
  const statusClass =
    status === "RUNNING"
      ? "running"
      : status === "WARNING"
      ? "warning"
      : "idle";

  return (
    <div className="machine-card">

      <div className="machine-header">
        <div>
          <h3>{name}</h3>
          <span>{machineCode} · {type}</span>
        </div>

        <div className={`machine-status ${statusClass}`}>
          <span></span>
          {status}
        </div>
      </div>

      <div className="machine-health">
        <div>
          <span>Machine Health</span>
          <strong>{health}%</strong>
        </div>

        <div className="health-bar">
          <div
            className="health-progress"
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>

      <div className="machine-metrics">

        <div className="machine-metric">
          <span>Temperature</span>
          <strong>{temperature}°C</strong>
        </div>

        <div className="machine-metric">
          <span>Vibration</span>
          <strong>{vibration} mm/s</strong>
        </div>

        <div className="machine-metric">
          <span>Power</span>
          <strong>{power} kW</strong>
        </div>

      </div>

    </div>
  );
}

export default MachineCard;