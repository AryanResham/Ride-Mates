// src/components/modals/SignupModal.jsx
import { useState } from "react";
import Modal from "../ui/Modal";
import { useAuth } from "../../contexts/AuthContext";

const ROLES = [
  { key: "passenger", label: "Find rides as a passenger", icon: "🧑‍✈️" },
  { key: "driver", label: "Offer rides as a driver", icon: "🚗" },
  { key: "both", label: "Both driver and passenger", icon: "🔁" },
];

export default function SignupModal({ open, onClose, onNavigate }) {
  const titleId = "signup-modal-title";
  const [role, setRole] = useState("both");
  const isActive = (k) => role === k;

  const { signup, authLoading, getIdTokenForBackend } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await signup(email, password, displayName);

      // OPTIONAL: send user metadata (role, phone) to your backend
      // If you have a backend later, get ID token and use it to call /api/users (example)
      // const token = await getIdTokenForBackend();
      // await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role, phone }),
      // });

      // reset & close
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAgreed(false);
      onClose();
      
      // Navigate based on role selection
      if (onNavigate) {
        if (role === "driver") {
          onNavigate("driver");
        } else if (role === "passenger") {
          onNavigate("passenger");
        } else {
          // Default to passenger for "both" role
          onNavigate("passenger");
        }
      }
    } catch (err) {
      const code = err?.code || err?.message || "";
      if (code.includes("auth/email-already-in-use")) {
        setError("That email is already registered.");
      } else if (code.includes("auth/invalid-email")) {
        setError("Invalid email address.");
      } else if (code.includes("auth/weak-password")) {
        setError("Choose a stronger password (6+ characters).");
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="rounded-2xl bg-white p-6 shadow-xl relative">
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Agreement */}
          <label className="mt-2 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
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
            disabled={authLoading}
            className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300 disabled:opacity-60"
          >
            {authLoading ? "Creating account..." : "Create Account"}
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
