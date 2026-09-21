import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const MACHINE_ID = 1;

// Temporary frontend simulation values.
// We will replace these with backend energy calculations later.
const ENERGY_CONFIG = {
  solarShare: 62,
  gridShare: 38,
  currentCost: 1840,
  optimizedCost: 1515,
  currentCO2: 82,
  optimizedCO2: 69,
  solarEnergy: 48.6,
  gridEnergy: 29.8,
  idleWaste: 7.4,
};

function EnergyCO2() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLivePower = async () => {
    try {
      const response = await fetch(
        `${API_URL}/live-data/${MACHINE_ID}?t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch live power");
      }

      const data = await response.json();

      if (data.length > 0) {
        setReading(data[0]);
      }
    } catch (error) {
      console.error("Energy live data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePower();

    const interval = setInterval(() => {
      fetchLivePower();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPower =
    reading?.power != null ? (reading.power / 1000).toFixed(2) : "—";

  const costSaving = ENERGY_CONFIG.currentCost - ENERGY_CONFIG.optimizedCost;

  const co2Reduction = ENERGY_CONFIG.currentCO2 - ENERGY_CONFIG.optimizedCO2;

  const costSavingPercentage =
    ENERGY_CONFIG.currentCost > 0
      ? ((costSaving / ENERGY_CONFIG.currentCost) * 100).toFixed(1)
      : 0;

  const co2ReductionPercentage =
    ENERGY_CONFIG.currentCO2 > 0
      ? ((co2Reduction / ENERGY_CONFIG.currentCO2) * 100).toFixed(1)
      : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Energy & CO₂
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Track energy usage, solar contribution, cost, and carbon impact
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-[#18a673]">
          <span className="h-2 w-2 rounded-full bg-[#18a673]" />
          Energy Monitoring
        </div>
      </div>

      {/* Current Energy */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current Power"
          value={loading ? "—" : currentPower}
          unit="kW"
          description="Live factory load"
        />

        <MetricCard
          title="Solar Energy"
          value={ENERGY_CONFIG.solarEnergy}
          unit="kWh"
          description="Simulated renewable contribution"
          valueClass="text-[#18a673]"
        />

        <MetricCard
          title="Grid Energy"
          value={ENERGY_CONFIG.gridEnergy}
          unit="kWh"
          description="Simulated grid consumption"
          valueClass="text-[#1597d4]"
        />

        <MetricCard
          title="Idle Waste"
          value={ENERGY_CONFIG.idleWaste}
          unit="kWh"
          description="Simulated avoidable usage"
          valueClass="text-[#e99a00]"
        />
      </div>

      {/* Energy Mix */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">Energy Mix</h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Simulated solar and grid contribution for the current operating period
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#667085]">
                Solar Contribution
              </p>

              <p className="mt-2 text-[32px] font-bold text-[#18a673]">
                {ENERGY_CONFIG.solarShare}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e6f8f1] text-lg text-[#18a673]">
              ☀
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className="h-full rounded-full bg-[#18a673]"
              style={{
                width: `${ENERGY_CONFIG.solarShare}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[12px] text-[#98a2b3]">
            <span>Solar</span>
            <span>{ENERGY_CONFIG.solarEnergy} kWh</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#667085]">
                Grid Contribution
              </p>

              <p className="mt-2 text-[32px] font-bold text-[#1597d4]">
                {ENERGY_CONFIG.gridShare}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f6fc] text-lg text-[#1597d4]">
              ⚡
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className="h-full rounded-full bg-[#1597d4]"
              style={{
                width: `${ENERGY_CONFIG.gridShare}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[12px] text-[#98a2b3]">
            <span>Grid</span>
            <span>{ENERGY_CONFIG.gridEnergy} kWh</span>
          </div>
        </div>
      </div>

      {/* Cost and CO2 */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Current vs Optimized
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Simulated impact of shifting machine operation toward efficient energy
          periods
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ComparisonCard
          title="Energy Cost"
          current={`₹${ENERGY_CONFIG.currentCost.toLocaleString()}`}
          optimized={`₹${ENERGY_CONFIG.optimizedCost.toLocaleString()}`}
          saving={`₹${costSaving.toLocaleString()}`}
          savingLabel={`${costSavingPercentage}% simulated reduction`}
        />

        <ComparisonCard
          title="CO₂ Emissions"
          current={`${ENERGY_CONFIG.currentCO2} kg`}
          optimized={`${ENERGY_CONFIG.optimizedCO2} kg`}
          saving={`${co2Reduction} kg`}
          savingLabel={`${co2ReductionPercentage}% simulated reduction`}
        />
      </div>

      {/* Machine Energy */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <h2 className="text-[17px] font-semibold text-[#172033]">
            Machine Energy Usage
          </h2>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Live power comes from the sensor stream; remaining values are
            currently simulated
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#e4e7ec] bg-[#f9fafb] text-left">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                  Machine
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                  Current Power
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                  Solar Share
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                  Grid Share
                </th>

                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                  Idle Waste
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-[#f0f2f5]">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#172033]">
                    CNC Mill
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#98a2b3]">CNC-001</p>
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#172033]">
                  {currentPower} kW
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#18a673]">
                  {ENERGY_CONFIG.solarShare}%
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#1597d4]">
                  {ENERGY_CONFIG.gridShare}%
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#e99a00]">
                  {ENERGY_CONFIG.idleWaste} kWh
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  unit,
  description,
  valueClass = "text-[#172033]",
}) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-medium text-[#667085]">{title}</p>

      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-[28px] font-bold ${valueClass}`}>{value}</span>

        <span className="text-sm font-semibold text-[#667085]">{unit}</span>
      </div>

      <p className="mt-2 text-[12px] text-[#98a2b3]">{description}</p>
    </div>
  );
}

function ComparisonCard({ title, current, optimized, saving, savingLabel }) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-medium text-[#667085]">{title}</p>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <p className="text-[11px] text-[#98a2b3]">Current</p>

          <p className="mt-2 text-[25px] font-bold text-[#172033]">{current}</p>
        </div>

        <div>
          <p className="text-[11px] text-[#98a2b3]">Optimized</p>

          <p className="mt-2 text-[25px] font-bold text-[#18a673]">
            {optimized}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-[#eef1f4] pt-4">
        <p className="text-sm font-semibold text-[#18a673]">{saving} saved</p>

        <p className="mt-1 text-[12px] text-[#98a2b3]">{savingLabel}</p>
      </div>
    </div>
  );
}

export default EnergyCO2;
