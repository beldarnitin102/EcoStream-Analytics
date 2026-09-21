import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const MACHINE_ID = 1;

function Reports() {
  const [machine, setMachine] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [error, setError] = useState("");

  const fetchReportData = async () => {
    try {
      setError("");

      const [machinesResponse, anomalyResponse, liveResponse] =
        await Promise.all([
          fetch(`${API_URL}/machines/`),
          fetch(`${API_URL}/anomaly/${MACHINE_ID}?t=${Date.now()}`, {
            cache: "no-store",
          }),
          fetch(`${API_URL}/live-data/${MACHINE_ID}?t=${Date.now()}`, {
            cache: "no-store",
          }),
        ]);

      if (!machinesResponse.ok || !anomalyResponse.ok || !liveResponse.ok) {
        throw new Error("Failed to fetch report data");
      }

      const machines = await machinesResponse.json();
      const anomalyData = await anomalyResponse.json();
      const liveData = await liveResponse.json();

      setMachine(machines.find((item) => item.id === MACHINE_ID) ?? null);
      setAnomaly(anomalyData);
      setReading(liveData.length > 0 ? liveData[0] : null);
    } catch (err) {
      console.error("Report data error:", err);
      setError("Unable to load report information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const health = machine?.health_score ?? anomaly?.health_score ?? 0;

  const anomalyRate =
    anomaly?.total_readings > 0
      ? ((anomaly.anomaly_readings / anomaly.total_readings) * 100).toFixed(1)
      : "0.0";

  const currentPower =
    reading?.power != null ? (reading.power / 1000).toFixed(2) : "—";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Reports
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Review machine performance, anomalies, and energy indicators
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="h-10 rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm text-[#172033] outline-none focus:border-[#1597d4]"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            type="button"
            onClick={fetchReportData}
            className="rounded-lg bg-[#1597d4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0877ad]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Report Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard
          title="Machine Health"
          value={loading ? "—" : `${Math.round(health)}%`}
          description="Current machine health"
          valueClass="text-[#18a673]"
        />

        <ReportCard
          title="Total Readings"
          value={loading ? "—" : (anomaly?.total_readings ?? 0)}
          description={`Analyzed over ${period} days`}
        />

        <ReportCard
          title="Anomaly Rate"
          value={loading ? "—" : `${anomalyRate}%`}
          description="Share of detected anomalies"
          valueClass="text-[#e99a00]"
        />

        <ReportCard
          title="Current Power"
          value={loading ? "—" : `${currentPower} kW`}
          description="Latest sensor reading"
          valueClass="text-[#1597d4]"
        />
      </div>

      {/* Machine Report */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">Machine Report</h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Current operational summary for Machine #{MACHINE_ID}
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Machine Name" value={machine?.name ?? "—"} />

          <DetailItem
            label="Machine Code"
            value={machine?.machine_code ?? "—"}
          />

          <DetailItem
            label="Machine Type"
            value={machine?.machine_type ?? "—"}
          />

          <DetailItem
            label="Current Status"
            value={machine?.status ?? anomaly?.status ?? "—"}
          />
        </div>
      </div>

      {/* Performance Sections */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Performance Summary
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Key indicators available from the current EcoTwin system
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Sensor Summary */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="border-b border-[#e4e7ec] px-5 py-4">
            <h3 className="text-[16px] font-semibold text-[#172033]">
              Latest Sensor Values
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-5 p-5">
            <SensorMetric
              label="Temperature"
              value={
                reading?.temperature != null ? `${reading.temperature} °C` : "—"
              }
            />

            <SensorMetric
              label="Vibration"
              value={
                reading?.vibration != null ? `${reading.vibration} mm/s` : "—"
              }
            />

            <SensorMetric
              label="Voltage"
              value={reading?.voltage != null ? `${reading.voltage} V` : "—"}
            />

            <SensorMetric
              label="Current"
              value={reading?.current != null ? `${reading.current} A` : "—"}
            />
          </div>
        </div>

        {/* Anomaly Summary */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="border-b border-[#e4e7ec] px-5 py-4">
            <h3 className="text-[16px] font-semibold text-[#172033]">
              Anomaly Summary
            </h3>
          </div>

          <div className="space-y-5 p-5">
            <ProgressRow
              label="Normal Readings"
              value={anomaly?.normal_readings ?? 0}
              total={anomaly?.total_readings ?? 0}
              percentage={
                anomaly?.total_readings
                  ? (anomaly.normal_readings / anomaly.total_readings) * 100
                  : 0
              }
            />

            <ProgressRow
              label="Anomaly Readings"
              value={anomaly?.anomaly_readings ?? 0}
              total={anomaly?.total_readings ?? 0}
              percentage={
                anomaly?.total_readings
                  ? (anomaly.anomaly_readings / anomaly.total_readings) * 100
                  : 0
              }
              warning
            />
          </div>
        </div>
      </div>

      {/* Report Notice */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#172033]">
              Report Export
            </h3>

            <p className="mt-1 text-sm text-[#667085]">
              PDF and CSV report generation will be connected to the backend
              after the report API is implemented.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-4 py-2.5 text-sm font-semibold text-[#98a2b3]"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportCard({
  title,
  value,
  description,
  valueClass = "text-[#172033]",
}) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-medium text-[#667085]">{title}</p>

      <p className={`mt-3 text-[28px] font-bold ${valueClass}`}>{value}</p>

      <p className="mt-1 text-[12px] text-[#98a2b3]">{description}</p>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

function SensorMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-[#eef1f4] bg-[#f9fafb] p-4">
      <p className="text-[11px] text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

function ProgressRow({ label, value, total, percentage, warning = false }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#172033]">{label}</p>

          <p className="mt-0.5 text-[11px] text-[#98a2b3]">
            {value} of {total}
          </p>
        </div>

        <span className="text-sm font-semibold text-[#172033]">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#eef1f4]">
        <div
          className={`h-full rounded-full ${
            warning ? "bg-[#e99a00]" : "bg-[#18a673]"
          }`}
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default Reports;
