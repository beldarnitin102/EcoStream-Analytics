import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import MachineCard from "../components/dashboard/MachineCard";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch registered machines
  const fetchMachines = async () => {
    try {
      const response = await fetch(`${API_URL}/machines/`);

      if (!response.ok) {
        throw new Error("Failed to fetch machines");
      }

      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error("Machine fetch error:", error);
    }
  };

  // Fetch latest sensor data for every machine
  const fetchLiveData = async () => {
    try {
      const results = await Promise.all(
        machines.map(async (machine) => {
          const response = await fetch(`${API_URL}/live-data/${machine.id}`);

          if (!response.ok) {
            throw new Error(
              `Failed to fetch live data for machine ${machine.id}`,
            );
          }

          const data = await response.json();

          return {
            machineId: machine.id,
            reading: data.length > 0 ? data[0] : null,
          };
        }),
      );

      const liveDataMap = {};

      results.forEach(({ machineId, reading }) => {
        liveDataMap[machineId] = reading;
      });



      setLiveData(liveDataMap);
      setLoading(false);
    } catch (error) {
      console.error("Live data fetch error:", error);
      setLoading(false);
    }
  };

  // Load machines once
  useEffect(() => {
    fetchMachines();
  }, []);

  // Start live data polling after machines are loaded
  useEffect(() => {
    if (machines.length === 0) {
      return;
    }

    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
    }, 2000);

    return () => clearInterval(interval);
  }, [machines]);

  // Calculate dashboard statistics
  const totalMachines = machines.length;

  const runningMachines = machines.filter(
    (machine) => machine.status === "RUNNING",
  ).length;

  const averageHealth =
    machines.length > 0
      ? Math.round(
          machines.reduce(
            (total, machine) => total + (machine.health_score ?? 0),
            0,
          ) / machines.length,
        )
      : 0;

  const totalPower = Object.values(liveData).reduce(
    (total, reading) => total + (reading?.power ?? 0),
    0,
  );

  return (
    <div className="w-full">
      {/* Page Heading */}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Machines"
          value={loading ? "—" : totalMachines}
          description="Registered machines"
          icon="◫"
        />

        <StatCard
          title="Machines Running"
          value={loading ? "—" : runningMachines}
          description="Currently operational"
          icon="▶"
          status="success"
        />

        <StatCard
          title="Average Health"
          value={loading ? "—" : averageHealth}
          unit="%"
          description="Across all machines"
          icon="♥"
          status="success"
        />

        <StatCard
          title="Power Consumption"
          value={loading ? "—" : (totalPower / 1000).toFixed(2)}
          unit="kW"
          description="Current factory load"
          icon="ϟ"
          status="warning"
        />
      </div>

      {/* Machine Overview */}
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
        {machines.map((machine) => {
          const reading = liveData[machine.id];

          return (
            <MachineCard
              key={machine.id}
              name={machine.name}
              machineCode={machine.machine_code}
              type={machine.machine_type}
              status={machine.status}
              health={Math.round(machine.health_score ?? 0)}
              temperature={reading?.temperature ?? "—"}
              vibration={reading?.vibration ?? "—"}
              power={reading?.power ? (reading.power / 1000).toFixed(2) : "—"}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
