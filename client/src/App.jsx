import LandingPage from "./pages/LandingPage";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState("landing");
  return (
    <>
      <div className="fixed top-0 z-50">
        <div className="flex gap-3 p-2">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-md font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            onClick={() => setMode("landing")}
          >
            Landing
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-md font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            onClick={() => setMode("driver")}
          >
            Driver
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-md font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            onClick={() => setMode("passenger")}
          >
            Passenger
          </button>
        </div>
      </div>
      {mode === "driver" && <DriverDashboard />}
      {mode === "passenger" && <PassengerDashboard />}
      {mode === "landing" && <LandingPage />}
    </>
  );
}

export default App;
