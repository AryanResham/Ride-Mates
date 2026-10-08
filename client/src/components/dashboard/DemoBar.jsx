import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, LogOut, ChevronDown } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

// Slim bar shown above the dashboards while signed in as a demo profile.
// Lets a visitor jump between the seeded accounts, reset the data, or leave the demo.
export default function DemoBar() {
  const { user, loginAsDemo, resetDemo, signout, authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/demo/profiles")
      .then(({ data }) => !cancelled && setProfiles([...data.drivers, ...data.riders]))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const switchTo = async (e) => {
    const id = e.target.value;
    if (!id || id === user?.id) return;
    setStatus("");
    try {
      await loginAsDemo(id);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleReset = async () => {
    setStatus("");
    try {
      await resetDemo();
      setStatus("Demo data reset.");
      setTimeout(() => setStatus(""), 2500);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-4 gap-y-2 py-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-yellow-300">
          <Sparkles className="h-4 w-4" /> Demo mode
        </span>

        <label className="inline-flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Viewing as</span>
          <span className="relative">
            <select
              value={user?.id || ""}
              onChange={switchTo}
              disabled={authLoading}
              className="appearance-none rounded-lg bg-slate-800 border border-slate-700 pl-3 pr-8 py-1.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
            >
              {profiles.length === 0 && user && (
                <option value={user.id}>
                  {user.name} ({user.isDriver ? "Driver" : "Rider"})
                </option>
              )}
              {profiles.filter((p) => p.isDriver).length > 0 && (
                <optgroup label="Drivers">
                  {profiles
                    .filter((p) => p.isDriver)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.city}
                      </option>
                    ))}
                </optgroup>
              )}
              {profiles.filter((p) => !p.isDriver).length > 0 && (
                <optgroup label="Riders">
                  {profiles
                    .filter((p) => !p.isDriver)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.city}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </label>

        {status && <span className="text-xs text-slate-300">{status}</span>}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={authLoading}
            title="Wipe all changes and reload the seeded demo data"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${authLoading ? "animate-spin" : ""}`} /> Reset data
          </button>
          <button
            onClick={signout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-2.5 py-1.5 text-xs font-semibold text-slate-900 hover:bg-yellow-300"
          >
            <LogOut className="h-3.5 w-3.5" /> Exit demo
          </button>
        </div>
      </div>
    </div>
  );
}
