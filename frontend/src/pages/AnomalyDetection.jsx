import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const MACHINE_ID = 1;

function AnomalyDetection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnomalyData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/anomaly/${MACHINE_ID}?t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch anomaly data");
      }

      const data = await response.json();

      setResult(data);
      setError("");
    } catch (err) {
      console.error("Anomaly fetch error:", err);
      setError("Unable to load anomaly analysis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalyData();

    const interval = setInterval(() => {
      fetchAnomalyData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const anomalyPercentage =
    result && result.total_readings > 0
      ? ((result.anomaly_readings / result.total_readings) * 100).toFixed(1)
      : 0;

  const isAnomaly = result?.latest_prediction === -1;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Anomaly Detection
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Monitor machine behavior and detect unusual operating patterns
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAnomalyData}
          className="self-start rounded-lg bg-[#1597d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0877ad]"
        >
          Refresh Analysis
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Machine"
          value={loading ? "—" : `#${result?.machine_id ?? MACHINE_ID}`}
          description="Selected machine"
        />

        <SummaryCard
          title="Total Readings"
          value={loading ? "—" : (result?.total_readings ?? 0)}
          description="Analyzed sensor readings"
        />

        <SummaryCard
          title="Normal Readings"
          value={loading ? "—" : (result?.normal_readings ?? 0)}
          description="Readings within learned pattern"
          valueClass="text-[#18a673]"
        />

        <SummaryCard
          title="Anomaly Readings"
          value={loading ? "—" : (result?.anomaly_readings ?? 0)}
          description={`${anomalyPercentage}% of analyzed readings`}
          valueClass="text-[#e99a00]"
        />
      </div>

      {/* Current Health */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Current Machine Condition
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Latest prediction from the anomaly detection model
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Health Score */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-[#667085]">
                Machine Health Score
              </p>

              <p className="mt-3 text-[40px] font-bold leading-none text-[#172033]">
                {loading ? "—" : (result?.health_score ?? 0)}
                {!loading && (
                  <span className="ml-1 text-lg font-semibold text-[#667085]">
                    %
                  </span>
                )}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg ${
                isAnomaly
                  ? "bg-[#fff4dc] text-[#e99a00]"
                  : "bg-[#e6f8f1] text-[#18a673]"
              }`}
            >
              {isAnomaly ? "!" : "✓"}
            </div>
          </div>

          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className={`h-full rounded-full ${
                isAnomaly ? "bg-[#e99a00]" : "bg-[#18a673]"
              }`}
              style={{
                width: `${Math.min(
                  Math.max(result?.health_score ?? 0, 0),
                  100,
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Current Status */}
        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <p className="text-[13px] font-medium text-[#667085]">
            Latest Detection
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl ${
                isAnomaly
                  ? "bg-[#fff4dc] text-[#e99a00]"
                  : "bg-[#e6f8f1] text-[#18a673]"
              }`}
            >
              {isAnomaly ? "⚠" : "✓"}
            </div>

            <div>
              <p
                className={`text-[20px] font-bold ${
                  isAnomaly ? "text-[#e99a00]" : "text-[#18a673]"
                }`}
              >
                {loading ? "Analyzing..." : (result?.status ?? "UNKNOWN")}
              </p>

              <p className="mt-1 text-sm text-[#667085]">
                {isAnomaly
                  ? "The latest reading is outside the learned normal pattern."
                  : "The latest reading is within the learned normal pattern."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <h2 className="text-[17px] font-semibold text-[#172033]">
            Detection Overview
          </h2>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Current anomaly analysis for Machine #{MACHINE_ID}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
          <InfoItem label="Detection method" value="Isolation Forest" />

          <InfoItem
            label="Prediction value"
            value={loading ? "—" : (result?.latest_prediction ?? "—")}
          />

          <InfoItem
            label="Analysis status"
            value={loading ? "Loading..." : "Active"}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  valueClass = "text-[#172033]",
}) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-medium text-[#667085]">{title}</p>

      <p className={`mt-3 text-[30px] font-bold ${valueClass}`}>{value}</p>

      <p className="mt-1 text-[12px] text-[#98a2b3]">{description}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-[#eef1f4] bg-[#f9fafb] p-4">
      <p className="text-[11px] font-medium text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

export default AnomalyDetection;
