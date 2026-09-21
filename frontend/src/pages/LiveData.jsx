import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";
const MACHINE_ID = 1;

function LiveData() {
  const [reading, setReading] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const fetchLiveData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/live-data/${MACHINE_ID}?t=${Date.now()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch live data");
      }

      const data = await response.json();

      if (data.length > 0) {
        setReading(data[0]);
        setHistory(data);
        setLastUpdated(new Date());
      }

      setError("");
    } catch (err) {
      console.error("Live data error:", err);
      setError("Unable to connect to live sensor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Live Data
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Real-time sensor readings from the selected machine
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-[#18a673]">
          <span className="h-2 w-2 rounded-full bg-[#18a673]" />
          Live
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Current Reading */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Temperature"
          value={reading?.temperature}
          unit="°C"
          loading={loading}
        />

        <MetricCard
          title="Vibration"
          value={reading?.vibration}
          unit="mm/s"
          loading={loading}
        />

        <MetricCard
          title="Voltage"
          value={reading?.voltage}
          unit="V"
          loading={loading}
        />

        <MetricCard
          title="Current"
          value={reading?.current}
          unit="A"
          loading={loading}
        />

        <MetricCard
          title="Power"
          value={
            reading?.power != null ? (reading.power / 1000).toFixed(2) : null
          }
          unit="kW"
          loading={loading}
        />
      </div>

      {/* Machine Information */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Current Reading
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Machine #{MACHINE_ID} · Latest sensor measurement
        </p>
      </div>

      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#172033]">
                Sensor Status
              </h3>

              <p className="mt-1 text-[12px] text-[#98a2b3]">
                Automatically refreshed every second
              </p>
            </div>

            {lastUpdated && (
              <span className="text-[11px] text-[#98a2b3]">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
          <SensorRow
            label="Temperature"
            value={reading?.temperature}
            unit="°C"
          />

          <SensorRow label="Vibration" value={reading?.vibration} unit="mm/s" />

          <SensorRow label="Voltage" value={reading?.voltage} unit="V" />

          <SensorRow label="Current" value={reading?.current} unit="A" />

          <SensorRow
            label="Power"
            value={
              reading?.power != null ? (reading.power / 1000).toFixed(2) : null
            }
            unit="kW"
          />

          <SensorRow
            label="Timestamp"
            value={
              reading?.timestamp
                ? new Date(reading.timestamp).toLocaleTimeString()
                : null
            }
            unit=""
          />
        </div>
      </div>

      {/* Recent Readings */}
      <div className="mb-5 mt-9">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Recent Readings
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Latest sensor records received from the machine
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#e4e7ec] bg-[#f9fafb] text-left">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Time
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Temperature
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Vibration
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Voltage
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Current
              </th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#98a2b3]">
                Power
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr
                key={`${item.timestamp}-${index}`}
                className="border-b border-[#f0f2f5] last:border-b-0"
              >
                <td className="px-5 py-4 text-sm text-[#667085]">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#172033]">
                  {item.temperature} °C
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#172033]">
                  {item.vibration} mm/s
                </td>

                <td className="px-5 py-4 text-sm text-[#667085]">
                  {item.voltage} V
                </td>

                <td className="px-5 py-4 text-sm text-[#667085]">
                  {item.current} A
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[#172033]">
                  {(item.power / 1000).toFixed(2)} kW
                </td>
              </tr>
            ))}

            {!loading && history.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-10 text-center text-sm text-[#98a2b3]"
                >
                  No live readings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, loading }) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-medium text-[#667085]">{title}</p>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[28px] font-bold text-[#172033]">
          {loading ? "—" : (value ?? "—")}
        </span>

        {!loading && value != null && (
          <span className="text-sm font-semibold text-[#667085]">{unit}</span>
        )}
      </div>
    </div>
  );
}

function SensorRow({ label, value, unit }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0f2f5] pb-4 last:border-b-0">
      <span className="text-sm text-[#667085]">{label}</span>

      <span className="text-sm font-semibold text-[#172033]">
        {value ?? "—"} {value != null && unit}
      </span>
    </div>
  );
}

export default LiveData;
