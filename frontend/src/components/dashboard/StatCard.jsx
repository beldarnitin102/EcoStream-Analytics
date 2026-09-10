function StatCard({
  title,
  value,
  unit,
  description,
  icon,
  status
}) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <div>
          <p className="stat-title">{title}</p>

          <div className="stat-value">
            {value}
            {unit && <span>{unit}</span>}
          </div>
        </div>

        <div className={`stat-icon ${status || ""}`}>
          {icon}
        </div>
      </div>

      {description && (
        <p className="stat-description">
          {description}
        </p>
      )}

    </div>
  );
}

export default StatCard;