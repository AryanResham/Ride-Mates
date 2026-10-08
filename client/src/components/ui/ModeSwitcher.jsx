import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Lets drivers flip between their driver and passenger dashboards.
// Accounts without a vehicle only have the passenger view, so the switcher is a plain badge for them.
export default function ModeSwitcher({ setMode, className = "", currentMode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isDriverView = currentMode === "driver";
  const canSwitch = Boolean(user?.isDriver);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const driverStyle =
    "border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus-visible:ring-yellow-400";
  const passengerStyle =
    "border-[#CFE1FF] bg-[#EAF2FF] text-[#204C9F] hover:bg-[#C4DBFF] focus-visible:ring-[#A5C8FF]";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => canSwitch && setOpen((v) => !v)}
        disabled={!canSwitch}
        title={canSwitch ? "Switch dashboard" : "Add a vehicle to your profile to offer rides"}
        className={`text-xs inline-flex items-center justify-center rounded-full border px-2.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default ${
          isDriverView ? driverStyle : passengerStyle
        }`}
      >
        {isDriverView ? "Driver" : "Passenger"}
        {canSwitch && <ChevronDown className="ml-1 h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 min-w-[8rem] rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              setMode(isDriverView ? "passenger" : "driver");
            }}
            className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
          >
            Switch to {isDriverView ? "Passenger" : "Driver"} view
          </button>
        </div>
      )}
    </div>
  );
}
