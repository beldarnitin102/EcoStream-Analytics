import StatCard from "../components/dashboard/StatCard";

function Dashboard() {
  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Factory Dashboard</h1>

          <p className="subtitle">
            Real-time insights for smarter, sustainable manufacturing
          </p>
        </div>

        <div className="dashboard-status">
          <span></span>
          System Online
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Machines"
          value="3"
          description="Registered machines"
          icon="◫"
        />

        <StatCard
          title="Machines Running"
          value="2"
          description="Currently operational"
          icon="▶"
          status="success"
        />

        <StatCard
          title="Average Health"
          value="94"
          unit="%"
          description="Across all machines"
          icon="♥"
          status="success"
        />

        <StatCard
          title="Power Consumption"
          value="5.6"
          unit="kW"
          description="Current factory load"
          icon="ϟ"
          status="warning"
        />
      </div>
    </div>
  );
}

export default Dashboard;