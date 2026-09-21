import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Machines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMachines = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/machines/`);

      if (!response.ok) {
        throw new Error("Failed to fetch machines");
      }

      const data = await response.json();
      setMachines(data);
    } catch (err) {
      console.error("Machine fetch error:", err);
      setError("Unable to load machines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const runningCount = machines.filter(
    (machine) => machine.status === "RUNNING"
  ).length;

  const idleCount = machines.filter(
    (machine) => machine.status === "IDLE"
  ).length;

  const warningCount = machines.filter(
    (machine) => machine.status === "WARNING"
  ).length;

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Machines
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Monitor registered machines and their current operational status
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMachines}
          className="self-start rounded-lg bg-[#1597d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0877ad]"
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <p className="text-[13px] font-medium text-[#667085]">
            Total Machines
          </p>

          <p className="mt-2 text-[30px] font-bold text-[#172033]">
            {loading ? "—" : machines.length}
          </p>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Registered in factory
          </p>
        </div>

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <p className="text-[13px] font-medium text-[#667085]">
            Running
          </p>

          <p className="mt-2 text-[30px] font-bold text-[#18a673]">
            {loading ? "—" : runningCount}
          </p>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Currently operational
          </p>
        </div>

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <p className="text-[13px] font-medium text-[#667085]">
            Idle
          </p>

          <p className="mt-2 text-[30px] font-bold text-[#667085]">
            {loading ? "—" : idleCount}
          </p>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Not currently running
          </p>
        </div>

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <p className="text-[13px] font-medium text-[#667085]">
            Warning
          </p>

          <p className="mt-2 text-[30px] font-bold text-[#e99a00]">
            {loading ? "—" : warningCount}
          </p>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Needs attention
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Machine List */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <h2 className="text-[17px] font-semibold text-[#172033]">
            Machine Registry
          </h2>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            All machines registered in Demo Factory
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-[#98a2b3]">
            Loading machines...
          </div>
        ) : machines.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#98a2b3]">
            No machines found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#e4e7ec] bg-[#f9fafb] text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Machine
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Code
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Type
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Health
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                    Factory ID
                  </th>
                </tr>
              </thead>

              <tbody>
                {machines.map((machine) => {
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

                  const currentStatus =
                    statusConfig[machine.status] ||
                    statusConfig.IDLE;

                  const health = Math.round(
                    machine.health_score ?? 0
                  );

                  return (
                    <tr
                      key={machine.id}
                      className="border-b border-[#f0f2f5] last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f6fc] text-sm font-bold text-[#1597d4]">
                            M
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[#172033]">
                              {machine.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#98a2b3]">
                              ID #{machine.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#172033]">
                        {machine.machine_code}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#667085]">
                        {machine.machine_type}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${currentStatus.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}
                          />
                          {machine.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[130px]">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[11px] text-[#98a2b3]">
                              Health
                            </span>

                            <span className="text-[12px] font-semibold text-[#172033]">
                              {health}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-[#eef1f4]">
                            <div
                              className="h-full rounded-full bg-[#18a673]"
                              style={{ width: `${health}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#667085]">
                        {machine.factory_id}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Machines;