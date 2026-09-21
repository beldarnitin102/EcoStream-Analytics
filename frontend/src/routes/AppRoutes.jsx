import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Machines from "../pages/Machines";
import LiveData from "../pages/LiveData";
import AnomalyDetection from "../pages/AnomalyDetection";
import EnergyCO2 from "../pages/EnergyCO2";
import Simulation from "../pages/Simulation";
import Reports from "../pages/Reports";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/machines" element={<Machines />} />
      <Route path="/live-data" element={<LiveData />} />
      <Route path="/anomaly-detection" element={<AnomalyDetection />} />
      <Route path="/energy-co2" element={<EnergyCO2 />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default AppRoutes;
