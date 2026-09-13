import StatCard from "../components/dashboard/StatCard";
import MachineCard from "../components/dashboard/MachineCard";

function Dashboard() {
  return (
    <div>
      {/* Page Heading */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033]">
            Factory Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Real-time insights for smarter, sustainable manufacturing
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-[#18a673]">
          <span className="h-2 w-2 rounded-full bg-[#18a673]"></span>
          System Online
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Machine Overview */}
      <div className="mb-4 mt-8">
        <h2 className="text-lg font-semibold text-[#172033]">
          Machine Overview
        </h2>

        <p className="mt-1 text-sm text-[#667085]">
          Current operational status and machine health
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MachineCard
          name="CNC Mill"
          machineCode="CNC-001"
          type="CNC"
          status="RUNNING"
          health={96}
          temperature={68.4}
          vibration={2.1}
          power={2.1}
        />

        <MachineCard
          name="Industrial Oven"
          machineCode="OVN-001"
          type="Oven"
          status="WARNING"
          health={88}
          temperature={74.2}
          vibration={2.8}
          power={2.4}
        />

        <MachineCard
          name="Air Compressor"
          machineCode="CMP-001"
          type="Compressor"
          status="IDLE"
          health={98}
          temperature={61.7}
          vibration={1.6}
          power={1.1}
        />
      </div>
    </div>
  );
}

export default Dashboard;