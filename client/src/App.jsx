import LandingPage from "./pages/LandingPage";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import CompleteProfile from "./pages/CompleteProfile"; // Import the new page
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [mode, setMode] = useState("landing");
  const { user, loading, profileCompletionRequired, signout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && !profileCompletionRequired) {
        // Set default mode based on user type, but allow manual switching
        if (user.isDriver) {
          setMode("driver");
        } else {
          setMode("passenger");
        }
      } else if (!user) {
        setMode("landing");
      }
    }
  }, [user, loading, profileCompletionRequired]);

  const renderContent = () => {
    if (profileCompletionRequired) {
      return <CompleteProfile />;
    }
    switch (mode) {
      case "driver":
        return <DriverDashboard setMode={setMode} currentMode={mode} />;
      case "passenger":
        return <PassengerDashboard setMode={setMode} currentMode={mode} />;
      default:
        return <LandingPage onNavigate={setMode} />;
    }
  };

  return (
    <>
      {/* Temporary Sign Out Button - now always visible */}
      {/* {user && (
        <button
          onClick={signout}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Force Sign Out
        </button>
      )} */}

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      ) : (
        renderContent()
      )}
    </>
  );
}

export default App;
