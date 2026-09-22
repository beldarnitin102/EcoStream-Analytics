import { useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Simulation() {
  const [season, setSeason] = useState("auto");
  const [load, setLoad] = useState("AUTO");
  const [duration, setDuration] = useState("90");
  const [degradation, setDegradation] = useState(true);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    const ranges = {
      auto: {
        temperature: "Season based",
        vibration: "1.5–2.5",
        voltage: "228–232",
        current: "Load based",
      },
      normal: {
        temperature: "60–70",
        vibration: "1.5–2.5",
        voltage: "228–232",
        current: "7.5–9.0",
      },
      summer: {
        temperature: "65–80",
        vibration: "1.5–2.5",
        voltage: "228–232",
        current: "7.5–9.0",
      },
      monsoon: {
        temperature: "61–74",
        vibration: "1.5–2.5",
        voltage: "228–232",
        current: "7.5–9.0",
      },
      winter: {
        temperature: "54–67",
        vibration: "1.5–2.5",
        voltage: "228–232",
        current: "7.5–9.0",
      },
    };

    const selected = ranges[season];

    return {
      temperature: selected.temperature,
      vibration: selected.vibration,
      voltage: selected.voltage,
      current:
        load === "IDLE"
          ? "4.5–7.0"
          : load === "HEAVY"
            ? "9.5–13.0"
            : load === "NORMAL"
              ? selected.current
              : "Load based",
    };
  }, [season, load]);

  const handleRunSimulation = async () => {
    try {
      setRunning(true);
      setError("");
      setResult(null);

      const response = await fetch(`${API_URL}/simulation/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days: Number(duration),
          season,
          load,
          degradation_enabled: degradation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to run simulation");
      }

      setResult(data);
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err.message || "Unable to run simulation.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#172033]">
            Simulation
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Generate machine data under different operating and environmental
            conditions
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-[#1597d4]">
          <span className="h-2 w-2 rounded-full bg-[#1597d4]" />
          Simulation Workspace
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ConfigSection title="Environment">
          <label className="mb-2 block text-[12px] font-medium text-[#667085]">
            Season
          </label>

          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm text-[#172033] outline-none focus:border-[#1597d4]"
          >
            <option value="auto">Automatic</option>
            <option value="normal">Normal</option>
            <option value="summer">Summer</option>
            <option value="monsoon">Monsoon</option>
            <option value="winter">Winter</option>
          </select>
        </ConfigSection>

        <ConfigSection title="Machine Load">
          <label className="mb-2 block text-[12px] font-medium text-[#667085]">
            Load
          </label>

          <select
            value={load}
            onChange={(event) => setLoad(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm text-[#172033] outline-none focus:border-[#1597d4]"
          >
            <option value="AUTO">Automatic Cycle</option>
            <option value="IDLE">Idle</option>
            <option value="NORMAL">Normal</option>
            <option value="HEAVY">Heavy</option>
          </select>
        </ConfigSection>

        <ConfigSection title="Simulation Duration">
          <label className="mb-2 block text-[12px] font-medium text-[#667085]">
            Duration
          </label>

          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm text-[#172033] outline-none focus:border-[#1597d4]"
          >
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </ConfigSection>
      </div>

      {/* Degradation + Run */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[13px] font-semibold text-[#172033]">
                Machine Degradation
              </p>

              <p className="mt-1 text-[12px] leading-relaxed text-[#98a2b3]">
                Gradually increase temperature, vibration, current, and power to
                simulate machine wear over time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDegradation((value) => !value)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                degradation ? "bg-[#1597d4]" : "bg-[#d0d5dd]"
              }`}
              aria-label="Toggle machine degradation"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  degradation ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={running}
          className="flex min-h-[100px] items-center justify-center rounded-xl bg-[#1597d4] px-7 text-sm font-semibold text-white shadow-[0_2px_6px_rgba(16,24,40,0.08)] transition hover:bg-[#0877ad] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Running..." : "Run Simulation"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-lg border border-[#fdecec] bg-[#fdecec] px-4 py-3 text-sm text-[#dc4b4b]">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mb-8 rounded-xl border border-[#e6f8f1] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
          <div className="border-b border-[#e6f8f1] bg-[#e6f8f1] px-5 py-4">
            <h2 className="text-[17px] font-semibold text-[#172033]">
              Simulation Completed
            </h2>

            <p className="mt-1 text-[12px] text-[#18a673]">
              The selected simulation was generated successfully.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 p-5 md:grid-cols-4">
            <ResultCard label="Duration" value={`${result.days} days`} />

            <ResultCard
              label="Readings Generated"
              value={result.readings_generated}
            />

            <ResultCard label="Season" value={result.season} />

            <ResultCard label="Load" value={result.load} />
          </div>
        </div>
      )}

      {/* Current Configuration */}
      <div className="mb-5">
        <h2 className="text-[21px] font-bold text-[#172033]">
          Current Configuration
        </h2>

        <p className="mt-1.5 text-sm text-[#667085]">
          Parameters selected for the next simulation run
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        <ConfigCard
          label="Season"
          value={
            season === "auto"
              ? "Automatic"
              : season.charAt(0).toUpperCase() + season.slice(1)
          }
        />

        <ConfigCard
          label="Machine Load"
          value={load === "AUTO" ? "Automatic Cycle" : load}
        />

        <ConfigCard label="Duration" value={`${duration} Days`} />

        <ConfigCard
          label="Degradation"
          value={degradation ? "Enabled" : "Disabled"}
        />
      </div>

      {/* Sensor Preview */}
      <div className="rounded-xl border border-[#e4e7ec] bg-white shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
        <div className="border-b border-[#e4e7ec] px-5 py-4">
          <h2 className="text-[17px] font-semibold text-[#172033]">
            Sensor Range Preview
          </h2>

          <p className="mt-1 text-[12px] text-[#98a2b3]">
            Expected ranges based on the selected environment and machine load
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <PreviewCard
            label="Temperature"
            value={preview.temperature}
            unit="°C"
          />

          <PreviewCard
            label="Vibration"
            value={preview.vibration}
            unit="mm/s"
          />

          <PreviewCard label="Voltage" value={preview.voltage} unit="V" />

          <PreviewCard label="Current" value={preview.current} unit="A" />
        </div>
      </div>
    </div>
  );
}

function ConfigSection({ title, children }) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[13px] font-semibold text-[#172033]">{title}</p>

      <p className="mt-1 text-[12px] text-[#98a2b3]">
        Configure the simulation parameters
      </p>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function ConfigCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_6px_rgba(16,24,40,0.05)]">
      <p className="text-[11px] font-medium text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[#eef1f4] bg-[#f9fafb] p-4">
      <p className="text-[11px] font-medium text-[#98a2b3]">{label}</p>

      <p className="mt-2 text-sm font-semibold capitalize text-[#172033]">
        {value}
      </p>
    </div>
  );
}

function PreviewCard({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-[#eef1f4] bg-[#f9fafb] p-5">
      <p className="text-[12px] font-medium text-[#667085]">{label}</p>

      <p className="mt-3 text-[22px] font-bold text-[#172033]">
        {value}
        <span className="ml-1 text-sm font-semibold text-[#667085]">
          {unit}
        </span>
      </p>
    </div>
  );
}

export default Simulation;
