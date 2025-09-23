import { useState } from "react";
import Modal from "../ui/Modal";

const ROLES = [
  { key: "passenger", label: "Find rides as a passenger", icon: "🧑‍✈️" },
  { key: "driver", label: "Offer rides as a driver", icon: "🚗" },
  { key: "both", label: "Both driver and passenger", icon: "🔁" },
];

export default function SignupModal({ open, onClose }) {
  const titleId = "signup-modal-title";
  const [role, setRole] = useState("both");
  const isActive = (k) => role === k;

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        {/* Brand mark */}
        <div className="text-sm font-semibold mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-300 ring-1 ring-yellow-400/60">
          RM
        </div>
        <h2
          id={titleId}
          className="mt-1 text-center text-2xl font-semibold text-slate-900"
        >
          Join Ride Mate
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          Create your account and start sharing rides
        </p>

        <form className="mt-5 space-y-4">
          {/* Role selection */}
          <div>
            <label className="text-sm font-medium text-slate-800">
              I want to:
            </label>
            <div className="mt-2 space-y-2">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition
                    ${
                      isActive(r.key)
                        ? "bg-yellow-400 border-yellow-500/60 text-slate-900"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                    }`}
                >
                  <span className="mr-2" aria-hidden="true">
                    {r.icon}
                  </span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-800">
                First Name
              </label>
              <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                <input
                  type="text"
                  placeholder="John"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-800">
                Last Name
              </label>
              <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-slate-800">
              Phone Number
            </label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-800">
              Password
            </label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Agreement */}
          <label className="mt-2 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I agree to the{" "}
              <a href="#terms" className="font-medium underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="font-medium underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href="#signin"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign in
          </a>
        </p>

        {/* Close (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>
    </Modal>
  );
}
