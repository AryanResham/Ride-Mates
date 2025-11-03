import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import ModeSwitcher from "../ui/ModeSwitcher";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardHeader({ setMode, currentMode }) {
  const { user, signout, authLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#EAECEF] ">
      <nav
        className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Global"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-yellow-400 ring-1 ring-black/5 flex items-center justify-center text-sm font-semibold">
            RM
          </div>
          <p className="text-xl font-semibold">
            <span className="text-gray-900">Ride</span>
            <span className="text-yellow-600">Mate</span>
          </p>
          <ModeSwitcher
            className="ml-3"
            setMode={setMode}
            currentMode={currentMode}
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {/* User info */}
          {user && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>Welcome, {user.displayName || user.email}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button className="font-medium rounded-xl bg-white/90 backdrop-blur px-3 py-2 text-sm border border-slate-200 shadow hover:bg-slate-100">
              <Settings className="inline mr-2 h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              disabled={authLoading}
              className="font-medium rounded-xl bg-white/90 backdrop-blur px-3 py-2 text-sm border border-slate-200 shadow hover:bg-slate-100 disabled:opacity-60"
            >
              <LogOut className="inline mr-2 h-4 w-4" />
              {authLoading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
