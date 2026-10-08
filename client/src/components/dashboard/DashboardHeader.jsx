import { LogOut } from "lucide-react";
import ModeSwitcher from "../ui/ModeSwitcher";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardHeader({ setMode, currentMode }) {
  const { user, signout, authLoading, isDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#EAECEF] ">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Global">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-yellow-400 ring-1 ring-black/5 flex items-center justify-center text-sm font-semibold">
            RM
          </div>
          <p className="text-xl font-semibold">
            <span className="text-gray-900">Ride</span>
            <span className="text-yellow-600">Mate</span>
          </p>
          <ModeSwitcher className="ml-3" setMode={setMode} currentMode={currentMode} />
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          {user && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-600">
              <span>Welcome, {user.name?.split(" ")[0] || user.email}</span>
            </div>
          )}
          {!isDemo && (
            <button
              onClick={signout}
              disabled={authLoading}
              className="font-medium rounded-xl bg-white/90 backdrop-blur px-3 py-2 text-sm border border-slate-200 shadow hover:bg-slate-100 disabled:opacity-60"
            >
              <LogOut className="inline mr-2 h-4 w-4" />
              {authLoading ? "Signing out..." : "Sign Out"}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
