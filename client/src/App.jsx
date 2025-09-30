import LandingPage from "./pages/LandingPage";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [mode, setMode] = useState("landing");
  const { user, loading } = useAuth();

  // Auto-redirect based on authentication state
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to passenger dashboard by default
        // In a real app, you might store user role preference and redirect accordingly
        setMode("passenger");
      } else {
        // If user is not logged in, show landing page
        setMode("landing");
      }
    }
  }, [user, loading]);

  // Show loading spinner while auth is loading
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

  return (
    <>
      {/* Development navigation - only show when not authenticated */}
      {!user && (
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
      )}
      
      {mode === "driver" && <DriverDashboard />}
      {mode === "passenger" && <PassengerDashboard />}
      {mode === "landing" && <LandingPage onNavigate={setMode} />}
    </>
  );
}

export default App;
