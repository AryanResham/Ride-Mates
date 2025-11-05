import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

export default function CompleteProfile() {
  const { user, authLoading } = useAuth(); // We get the partial user from context

  const [formData, setFormData] = useState({
    phone: "",
    vehicle: {
      model: "",
      plateNumber: "",
    },
  });
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "model" || name === "plateNumber") {
      setFormData((prev) => ({
        ...prev,
        vehicle: { ...prev.vehicle, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const token = await user.getIdToken();
      const payload = {
        name: user.displayName,
        email: user.email,
        phone: formData.phone,
      };
      if (isDriver) {
        payload.vehicle = formData.vehicle;
      }

      const response = await api.post("/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // On success, the onAuthStateChanged listener in AuthContext will automatically
      // re-fetch the full profile and redirect to the correct dashboard.
      // No navigation needed here.
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-lg">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Complete Your Profile
          </h2>
          <p className="mt-1 text-center text-sm text-slate-600">
            Welcome, {user?.displayName}! Just a few more details to get you
            started.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-800">Name</label>
              <div className="mt-1 rounded-xl bg-slate-100 border-slate-200 px-3 py-2.5 text-sm text-slate-600">
                {user?.displayName || "-"}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">
                Email
              </label>
              <div className="mt-1 rounded-xl bg-slate-100 border-slate-200 px-3 py-2.5 text-sm text-slate-600">
                {user?.email || "-"}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">
                Phone Number
              </label>
              <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-transparent text-sm outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isDriver}
                onChange={(e) => setIsDriver(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Sign up as a driver</span>
            </label>

            {isDriver && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-slate-200 rounded-xl">
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Vehicle Model
                  </label>
                  <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                    <input
                      type="text"
                      name="model"
                      placeholder="e.g., Toyota Camry"
                      className="w-full bg-transparent text-sm outline-none"
                      value={formData.vehicle.model}
                      onChange={handleChange}
                      required={isDriver}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Plate Number
                  </label>
                  <div className="mt-1 rounded-xl border border-slate-200 px-3 py-2.5">
                    <input
                      type="text"
                      name="plateNumber"
                      placeholder="e.g., ABC-123"
                      className="w-full bg-transparent text-sm outline-none"
                      value={formData.vehicle.plateNumber}
                      onChange={handleChange}
                      required={isDriver}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 border border-yellow-500/60 hover:bg-yellow-300 disabled:opacity-60"
            >
              {authLoading ? "Saving..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
