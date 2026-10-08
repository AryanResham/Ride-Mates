import { useState } from "react";
import { Sparkles } from "lucide-react";
import Modal from "../ui/Modal";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginModal({ open, onClose, onSwitchToSignup, onTryDemo }) {
  const titleId = "login-modal-title";
  const { login, authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="rounded-2xl bg-white p-6 shadow-xl relative w-[min(28rem,92vw)]">
        <div className="text-sm font-semibold mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-300 ring-1 ring-yellow-400/60">
          RM
        </div>
        <h3 className="text-center text-lg font-semibold">Ride Mate</h3>
        <h2 id={titleId} className="mt-2 text-center text-2xl font-semibold text-slate-900">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">Password</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300 disabled:opacity-60"
          >
            {authLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] text-slate-500">OR</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onTryDemo?.();
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-yellow-500/70 bg-yellow-50 px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-yellow-100"
          >
            <Sparkles className="h-4 w-4 text-yellow-600" /> Explore the demo without an account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <button type="button" onClick={onSwitchToSignup} className="font-medium text-slate-900 hover:underline">
            Sign up
          </button>
        </p>

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
