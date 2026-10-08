import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Navbar({
  links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Why Ride Mates", href: "#why" },
  ],
  setLoginOpen,
  setSignupOpen,
  onTryDemo,
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-[#EAECEF] ">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
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
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <button
              onClick={onTryDemo}
              className="inline-flex items-center gap-1.5 font-medium rounded-xl px-3 py-2 text-sm text-slate-800 border border-dashed border-yellow-500/70 bg-yellow-50 hover:bg-yellow-100"
            >
              <Sparkles className="h-4 w-4 text-yellow-600" /> Try Demo
            </button>
            <button
              onClick={() => setLoginOpen(true)}
              className="font-medium rounded-xl bg-white/90 backdrop-blur px-3 py-2 text-sm border border-slate-200 shadow hover:bg-slate-100"
            >
              Login
            </button>
            <button
              onClick={() => setSignupOpen(true)}
              className="font-medium rounded-xl bg-yellow-400 px-3 py-2 text-sm border border-yellow-500/60 hover:bg-yellow-300"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className={`h-5 w-5 ${open ? "hidden" : "block"}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className={`h-5 w-5 ${open ? "block" : "hidden"}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div className={`md:hidden border-t border-[#EAECEF] ${open ? "block" : "hidden"} bg-white`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block w-full rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => {
                setOpen(false);
                onTryDemo();
              }}
              className="inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-dashed border-yellow-500/70 bg-yellow-50 hover:bg-yellow-100"
            >
              <Sparkles className="h-4 w-4 text-yellow-600" /> Try Demo
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setLoginOpen(true);
                }}
                className="flex-1 text-center text-sm px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setSignupOpen(true);
                }}
                className="flex-1 text-center text-sm px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 border border-yellow-500/60"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
