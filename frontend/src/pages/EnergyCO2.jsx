import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const MACHINE_ID = 1;

function EnergyCO2() {
  const [period, setPeriod] = useState("7");
  const [energyData, setEnergyData] = useState(null);
  const [currentPower, setCurrentPower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnergyData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/energy/${MACHINE_ID}?days=${period}&t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch energy data");
      }

      const data = await response.json();

      setEnergyData(data);
      setError("");
    } catch (err) {
      console.error("Energy data error:", err);
      setError("Unable to load energy data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPower = async () => {
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
        setCurrentPower(data[0].power / 1000);
      }
    } catch (err) {
      console.error("Live power error:", err);
    }
  };

  useEffect(() => {
    fetchEnergyData();
  }, [period]);

  useEffect(() => {
    fetchCurrentPower();

    const interval = setInterval(() => {
      fetchCurrentPower();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const solarShare = energyData?.solar_share_percent ?? 0;
  const gridShare = energyData?.grid_share_percent ?? 0;

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

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="h-10 rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm text-[#172033] outline-none focus:border-[#1597d4]"
          >
            <option value="1">Last 1 Day</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <div className="flex items-center gap-2 text-sm font-medium text-[#18a673]">
            <span className="h-2 w-2 rounded-full bg-[#18a673]" />
            Live
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current Power"
          value={currentPower != null ? currentPower.toFixed(2) : "—"}
          unit="kW"
          description="Live machine load"
        />

        <MetricCard
          title="Total Energy"
          value={
            loading ? "—" : (energyData?.total_energy_kwh?.toFixed(2) ?? "0.00")
          }
          unit="kWh"
          description={`Last ${period} days`}
        />

        <MetricCard
          title="Solar Energy"
          value={
            loading ? "—" : (energyData?.solar_energy_kwh?.toFixed(2) ?? "0.00")
          }
          unit="kWh"
          description={`${solarShare}% solar contribution`}
          valueClass="text-[#18a673]"
        />

        <MetricCard
          title="Grid Energy"
          value={
            loading ? "—" : (energyData?.grid_energy_kwh?.toFixed(2) ?? "0.00")
          }
          unit="kWh"
          description={`${gridShare}% grid contribution`}
          valueClass="text-[#1597d4]"
        />
      </div>

      {/* Energy Mix */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">Energy Mix</h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Calculated from sensor readings for the selected period
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <EnergyMixCard
          title="Solar Contribution"
          percentage={solarShare}
          energy={energyData?.solar_energy_kwh}
          type="solar"
        />

        <EnergyMixCard
          title="Grid Contribution"
          percentage={gridShare}
          energy={energyData?.grid_energy_kwh}
          type="grid"
        />
      </div>

      {/* Cost and CO2 */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Current vs Optimized
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Calculated impact of shifting energy usage toward available solar
          periods
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ComparisonCard
          title="Energy Cost"
          current={`₹${(energyData?.current_cost_inr ?? 0).toFixed(2)}`}
          optimized={`₹${(energyData?.optimized_cost_inr ?? 0).toFixed(2)}`}
          saving={`₹${(energyData?.cost_saving_inr ?? 0).toFixed(2)}`}
        />

        <ComparisonCard
          title="CO₂ Emissions"
          current={`${(energyData?.current_co2_kg ?? 0).toFixed(2)} kg`}
          optimized={`${(energyData?.optimized_co2_kg ?? 0).toFixed(2)} kg`}
          saving={`${(energyData?.co2_reduction_kg ?? 0).toFixed(2)} kg`}
        />
      </div>

      {/* Energy Details */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <h2 className="text-[17px] font-semibold text-[#172033]">
            Energy Details
          </h2>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Machine #{MACHINE_ID} · Last {period} days
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            label="Total Energy"
            value={`${(energyData?.total_energy_kwh ?? 0).toFixed(2)} kWh`}
          />

          <DetailItem label="Solar Share" value={`${solarShare}%`} />

          <DetailItem label="Grid Share" value={`${gridShare}%`} />

          <DetailItem
            label="Idle Waste"
            value={`${(energyData?.idle_waste_kwh ?? 0).toFixed(2)} kWh`}
          />

          <DetailItem
            label="Current Cost"
            value={`₹${(energyData?.current_cost_inr ?? 0).toFixed(2)}`}
          />

          <DetailItem
            label="Optimized Cost"
            value={`₹${(energyData?.optimized_cost_inr ?? 0).toFixed(2)}`}
          />

          <DetailItem
            label="Current CO₂"
            value={`${(energyData?.current_co2_kg ?? 0).toFixed(2)} kg`}
          />

          <DetailItem
            label="Optimized CO₂"
            value={`${(energyData?.optimized_co2_kg ?? 0).toFixed(2)} kg`}
          />
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

function EnergyMixCard({ title, percentage, energy, type }) {
  const isSolar = type === "solar";

  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#667085]">{title}</p>

          <p
            className={`mt-2 text-[32px] font-bold ${
              isSolar ? "text-[#18a673]" : "text-[#1597d4]"
            }`}
          >
            {percentage.toFixed(1)}%
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg ${
            isSolar
              ? "bg-[#e6f8f1] text-[#18a673]"
              : "bg-[#e8f6fc] text-[#1597d4]"
          }`}
        >
          {isSolar ? "☀" : "⚡"}
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#eef1f4]">
        <div
          className={`h-full rounded-full ${
            isSolar ? "bg-[#18a673]" : "bg-[#1597d4]"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[12px] text-[#98a2b3]">
        <span>{isSolar ? "Solar" : "Grid"}</span>
        <span>{energy != null ? `${energy.toFixed(2)} kWh` : "—"}</span>
      </div>
    </div>
  );
}

function ComparisonCard({ title, current, optimized, saving }) {
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
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg border border-[#eef1f4] bg-[#f9fafb] p-4">
      <p className="text-[11px] font-medium text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

export default EnergyCO2;
