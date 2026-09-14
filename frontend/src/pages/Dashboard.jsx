import StatCard from "../components/dashboard/StatCard";
import MachineCard from "../components/dashboard/MachineCard";

function Dashboard() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Factory Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Real-time insights for smarter, sustainable manufacturing
          </p>
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#18a673]">
          <span className="h-2 w-2 rounded-full bg-[#18a673]" />
          System Online
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Machine Section */}
      <div className="mb-5 mt-9">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Machine Overview
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Current operational status and machine health
        </p>
      </div>

      {/* Machine Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
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