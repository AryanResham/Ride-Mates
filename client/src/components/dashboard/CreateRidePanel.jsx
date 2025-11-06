import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Geocoder from "../ui/Geocoder";
import { Field, Input, Select, Textarea } from "../ui/FormUi";
import api from "../../utils/api";

export default function CreateRidePanel() {
  const { getIdToken } = useAuth();
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [form, setForm] = useState({
    date: "",
    time: "",
    seats: 1,
    price: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fromLocation || !toLocation) {
      setError("Please select a starting location and destination.");
      return;
    }

    setLoading(true);
    try {
      // Get the Firebase ID token
      const token = await getIdToken();

      const rideData = {
        ...form,
        from: fromLocation.place_name,
        to: toLocation.place_name,
        fromLocation: {
          type: "Point",
          coordinates: fromLocation.center,
        },
        toLocation: {
          type: "Point",
          coordinates: toLocation.center,
        },
        availableSeats: form.seats,
        pricePerSeat: form.price,
      };

      // Log the route being called for creating rides
      console.log("🚗 [CREATE RIDE] Posting to route:", "/api/driver/rides");
      console.log("📊 [CREATE RIDE] Data being sent:", rideData);
      console.log("🕐 [CREATE RIDE] Time:", new Date().toLocaleTimeString());

      const response = await api.post("/api/driver/rides", rideData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Ride created successfully!");
      // Optionally reset form here
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = () => {
    // TODO: save draft
    console.log("Save as draft:", form);
  };

  return (
    <>
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-5 sm:p-6 md:p-8 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Ride
            </h2>
            <p className="text-gray-500 mt-1">
              Share your journey and connect with passengers
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* From / To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="From">
                  <Geocoder
                    onResult={setFromLocation}
                    placeholder="Starting location"
                  />
                </Field>
                <Field label="To">
                  <Geocoder
                    onResult={setToLocation}
                    placeholder="Destination"
                  />
                </Field>
              </div>

              {/* Date / Time / Seats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Date">
                  <Input
                    type="date"
                    name="date"
                    placeholder="dd-mm-yyyy"
                    value={form.date}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Time">
                  <Input
                    type="time"
                    name="time"
                    placeholder="--:-- --"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Available Seats">
                  <Select
                    name="seats"
                    value={form.seats}
                    onChange={handleChange}
                    options={[1, 2, 3, 4, 5, 6].map((n) => ({
                      label: `${n} seat${n > 1 ? "s" : ""}`,
                      value: n,
                    }))}
                  />
                </Field>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Price per seat">
                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                                      ₹
                                    </span>                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      className="pl-7"
                    />
                  </div>
                </Field>
              </div>

              {/* Notes */}
              <Field label="Additional Notes">
                <Textarea
                  name="notes"
                  rows={3}
                  placeholder="Any additional information for passengers..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </Field>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
                >
                  + Create Ride
                </button>
                <button
                  type="button"
                  onClick={handleDraft}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
