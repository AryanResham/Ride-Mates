import { useState } from "react";
import Modal from "../ui/Modal";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupModal({ open, onClose }) {
  const titleId = "signup-modal-title";
  const { signup, loginWithGoogle, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicle: {
      model: "",
      plateNumber: "",
    },
  });
  const [isDriver, setIsDriver] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "model" || name === "plateNumber") {
      setFormData(prev => ({ ...prev, vehicle: { ...prev.vehicle, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      const payload = { ...formData };
      if (!isDriver) {
        delete payload.vehicle; // Don't send vehicle info if not a driver
      }
      await signup(payload);
      onClose(); // Close modal on success
    } catch (err) {
      const code = err?.code || err?.message || "";
      if (code.includes("auth/email-already-in-use")) {
        setError("That email is already registered.");
      } else if (code.includes("auth/invalid-email")) {
        setError("Invalid email address.");
      } else if (code.includes("auth/weak-password")) {
        setError("Choose a stronger password (6+ characters).");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginWithGoogle();
      // On success, the AuthContext will handle the rest
      onClose();
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="rounded-2xl bg-white p-6 shadow-xl relative">
        <h2 id={titleId} className="mt-1 text-center text-2xl font-semibold text-slate-900">Join Ride Mates</h2>
        <p className="mt-1 text-center text-sm text-slate-600">Create your account and start sharing rides</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-800">Full Name</label>
              <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                <input type="text" name="name" placeholder="John Doe" className="w-full bg-transparent text-sm outline-none" value={formData.name} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-800">Phone Number</label>
              <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                <input type="tel" name="phone" placeholder="+1 (555) 123-4567" className="w-full bg-transparent text-sm outline-none" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">Email</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input type="email" name="email" placeholder="john@example.com" className="w-full bg-transparent text-sm outline-none" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800">Password</label>
            <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
              <input type="password" name="password" placeholder="Create a strong password" className="w-full bg-transparent text-sm outline-none" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={isDriver} onChange={(e) => setIsDriver(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            <span>Sign up as a driver</span>
          </label>

          {isDriver && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-slate-200 rounded-xl">
              <div>
                <label className="text-sm font-medium text-slate-800">Vehicle Model</label>
                <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                  <input type="text" name="model" placeholder="e.g., Toyota Camry" className="w-full bg-transparent text-sm outline-none" value={formData.vehicle.model} onChange={handleChange} required={isDriver} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">Plate Number</label>
                <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                  <input type="text" name="plateNumber" placeholder="e.g., ABC-123" className="w-full bg-transparent text-sm outline-none" value={formData.vehicle.plateNumber} onChange={handleChange} required={isDriver} />
                </div>
              </div>
            </div>
          )}

          <label className="mt-2 flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300" />
            <span>I agree to the <a href="#terms" className="font-medium underline">Terms of Service</a> and <a href="#privacy" className="font-medium underline">Privacy Policy</a>.</span>
          </label>

          <button type="submit" disabled={authLoading} className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300 disabled:opacity-60">
            {authLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-500">OR</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={authLoading}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <span className="mr-1.5" aria-hidden="true">🟢</span> Google
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
            disabled
            title="Facebook not implemented"
          >
            <span className="mr-1.5" aria-hidden="true">📘</span> Facebook
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-slate-600">Already have an account? <a href="#signin" className="font-medium text-slate-900 hover:underline">Sign in</a></p>

        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100">✕</button>
      </div>
    </Modal>
  );
}
