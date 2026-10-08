import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import DemoPicker from "./pages/DemoPicker";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import DemoBar from "./components/dashboard/DemoBar";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [mode, setMode] = useState("landing"); // landing | demo | driver | passenger
  const { user, loading, isDemo, sessionKey } = useAuth();

  // Land on the dashboard matching the account; passengers can't open the driver view.
  useEffect(() => {
    if (loading) return;
    if (user) {
      setMode(user.isDriver ? "driver" : "passenger");
    } else {
      setMode((m) => (m === "demo" ? "demo" : "landing"));
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (mode === "demo") return <DemoPicker onBack={() => setMode("landing")} />;
    return <LandingPage onTryDemo={() => setMode("demo")} />;
  }

  // Keyed by user id + session so switching demo profiles or resetting demo data
  // remounts the dashboard and every tab refetches instead of showing stale lists.
  const dashboard =
    mode === "driver" && user.isDriver ? (
      <DriverDashboard key={`${user.id}-${sessionKey}`} setMode={setMode} currentMode="driver" />
    ) : (
      <PassengerDashboard key={`${user.id}-${sessionKey}`} setMode={setMode} currentMode="passenger" />
    );

  return (
    <>
      {isDemo && <DemoBar />}
      {dashboard}
    </>
  );
}

export default App;
