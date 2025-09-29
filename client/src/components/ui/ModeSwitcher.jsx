import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ModeSwitcher({ setMode, className = "" }) {
  const [open, setOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState("Passenger");
  const driverStyle =
    "border-yellow-300 bg-yellow-100 px-2 py-1 text-yellow-800 hover:bg-yellow-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2";
  const passengerStyle =
    "border-[#CFE1FF] bg-[#EAF2FF] px-2 py-1 text-[#204C9F] hover:bg-[#C4DBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A5C8FF] focus-visible:ring-offset-2";

  return (
    <div className={`relative ${className}`}>
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className={`text-xs inline-flex items-center justify-center rounded-full border ${
          currentMode === "Driver" ? driverStyle : passengerStyle
        }`}
      >
        {currentMode}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute left-0 mt-2  text-center rounded-lg border border-slate-200 bg-white shadow-lg">
          {currentMode === "Passenger" && (
            <button
              onClick={() => {
                setOpen(!open);
                setCurrentMode("Driver");
                setMode("driver");
              }}
              className="block w-full px-4 py-2  text-slate-700 hover:bg-slate-100"
            >
              Driver
            </button>
          )}
          {currentMode === "Driver" && (
            <button
              onClick={() => {
                setOpen(!open);
                setCurrentMode("Passenger");
                setMode("passenger");
              }}
              className="block w-full px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Passenger
            </button>
          )}
        </div>
      )}
    </div>
  );
}
