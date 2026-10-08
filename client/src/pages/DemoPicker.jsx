import { useEffect, useState } from "react";
import { ArrowLeft, Car, Star, MapPin, Clock, Inbox, Wallet, Sparkles } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { shortCity } from "../utils/cities";

export default function DemoPicker({ onBack }) {
  const { loginAsDemo, authLoading } = useAuth();
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState("");
  const [startingId, setStartingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/demo/profiles")
      .then(({ data }) => !cancelled && setProfiles(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const start = async (id) => {
    setError("");
    setStartingId(id);
    try {
      await loginAsDemo(id);
    } catch (err) {
      setError(err.message);
      setStartingId(null);
    }
  };

  return (
    <div className="font-display min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#EAECEF]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-yellow-400 ring-1 ring-black/5 flex items-center justify-center text-sm font-semibold">
              RM
            </div>
            <p className="text-xl font-semibold">
              <span className="text-gray-900">Ride</span>
              <span className="text-yellow-600">Mate</span>
            </p>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-300">
              <Sparkles className="h-3 w-3" /> Demo
            </span>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Pick a profile to explore
          </h1>
          <p className="mt-3 text-slate-600">
            Every profile is a real account with pre-loaded rides, requests and history. Book a ride as a
            passenger, then switch to that driver and accept it. You can jump between profiles at any time
            from the bar at the top of the dashboard.
          </p>
        </div>

        {error && (
          <div className="mt-6 mx-auto max-w-xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {!profiles && !error && (
          <div className="mt-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400 mx-auto" />
            <p className="mt-3 text-slate-500 text-sm">Loading demo profiles… (first load after idle can take ~30s)</p>
          </div>
        )}

        {profiles && (
          <>
            <Section
              title="Drivers"
              subtitle="Manage rides, respond to passenger requests, mark trips complete."
              icon={<Car className="h-5 w-5 text-yellow-700" />}
            >
              {profiles.drivers.map((p) => (
                <ProfileCard key={p.id} profile={p} onStart={start} busy={authLoading} startingId={startingId} />
              ))}
            </Section>

            <Section
              title="Riders"
              subtitle="Search rides between cities, send requests, rate past trips."
              icon={<MapPin className="h-5 w-5 text-blue-700" />}
            >
              {profiles.riders.map((p) => (
                <ProfileCard key={p.id} profile={p} onStart={start} busy={authLoading} startingId={startingId} />
              ))}
            </Section>
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, subtitle, icon, children }) {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">{icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </section>
  );
}

function ProfileCard({ profile, onStart, busy, startingId }) {
  const { id, name, city, avatar, rating, isDriver, vehicle, summary, routes = [], bio } = profile;
  const isStarting = startingId === id;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <img
          src={avatar || "/default-avatar.svg"}
          alt={name}
          className="h-14 w-14 rounded-full bg-gray-100 object-cover ring-2 ring-gray-100"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {city}
          </p>
          <p className="text-sm text-slate-700 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
            <span className="font-medium">{rating?.average?.toFixed(1) ?? "New"}</span>
            <span className="text-slate-400">({rating?.count ?? 0})</span>
          </p>
        </div>
      </div>

      {bio && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{bio}</p>}

      {isDriver ? (
        <>
          <p className="mt-3 text-sm text-slate-700 flex items-center gap-2">
            <Car className="h-4 w-4 text-slate-400" />
            {vehicle?.model} <span className="text-slate-400">· {vehicle?.plateNumber}</span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Stat label="Completed" value={summary.completedRides} />
            <Stat label="Upcoming" value={summary.upcomingRides} />
            <Stat label="Requests" value={summary.pendingRequests} highlight={summary.pendingRequests > 0} />
          </div>
          {routes.length > 0 && (
            <ul className="mt-3 space-y-1">
              {routes.map((r, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {shortCity(r.from)} → {shortCity(r.to)} ·{" "}
                  {new Date(r.departureDateTime).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Trips" value={summary.completedTrips} />
          <Stat label="Spent" value={`₹${summary.totalSpent}`} icon={<Wallet className="h-3 w-3" />} />
          <Stat label="Pending" value={summary.pendingRequests} highlight={summary.pendingRequests > 0} icon={<Inbox className="h-3 w-3" />} />
        </div>
      )}

      <button
        onClick={() => onStart(id)}
        disabled={busy}
        className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
          isDriver
            ? "bg-yellow-400 text-slate-900 border border-yellow-500/60 hover:bg-yellow-300"
            : "bg-[#EAF2FF] text-[#204C9F] border border-[#CFE1FF] hover:bg-[#DCE9FF]"
        }`}
      >
        {isStarting ? "Opening dashboard…" : `Continue as ${name.split(" ")[0]}`}
      </button>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className={`rounded-lg px-2 py-2 ${highlight ? "bg-yellow-50" : "bg-gray-50"}`}>
      <p className={`text-base font-semibold ${highlight ? "text-yellow-800" : "text-slate-900"}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
