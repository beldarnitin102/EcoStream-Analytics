function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <div className="logo-mark">E</div>

        <div>
          <h2>EcoTwin</h2>
          <span>FACTORY DIGITAL TWIN</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <button className="nav-item active">
          <span>▦</span>
          Dashboard
        </button>

        <button className="nav-item">
          <span>◫</span>
          Machines
        </button>

        <button className="nav-item">
          <span>⌁</span>
          Live Data
        </button>

        <button className="nav-item">
          <span>⚠</span>
          Anomaly Detection
        </button>

        <button className="nav-item">
          <span>◒</span>
          Energy & CO₂
        </button>

        <button className="nav-item">
          <span>◷</span>
          Simulation
        </button>

        <button className="nav-item">
          <span>▤</span>
          Reports
        </button>

      </nav>

      {/* Factory */}
      <div className="factory-box">

        <span className="factory-status"></span>

        <div>
          <strong>Demo Factory</strong>
          <small>Jalgaon</small>
        </div>

        <span className="factory-arrow">›</span>

      </div>

    </aside>
  );
}

export default Sidebar;