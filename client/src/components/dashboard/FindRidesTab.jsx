import { useState } from "react";
import { MessageSquare, Phone, Star } from "lucide-react";
import { Field, Input } from "../ui/FormUi";
import Geocoder from "../ui/Geocoder";

export default function FindRidesTab() {
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [form, setForm] = useState({ date: "", time: "" });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSearch = async () => {
    if (!fromLocation || !toLocation || !form.date || !form.time) {
      setError("Please select start, destination, date, and time.");
      return;
    }
    setLoading(true);
    setError(null);
    setRides([]);

    try {
      const response = await fetch("/api/rider/rides/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies
        body: JSON.stringify({
          fromLocation: {
            type: "Point",
            coordinates: fromLocation.center,
          },
          toLocation: {
            type: "Point",
            coordinates: toLocation.center,
          },
          date: form.date,
          time: form.time,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch rides");
      }

      const data = await response.json();
      setRides(data.rides || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 sm:p-6 md:p-8 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Find a Ride</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="From">
              <Geocoder onResult={setFromLocation} placeholder="Starting location" />
            </Field>
            <Field label="To">
              <Geocoder onResult={setToLocation} placeholder="Destination" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Date">
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                placeholder="dd-mm-yyyy"
              />
            </Field>
            <Field label="Time">
              <Input
                type="time"
                name="time"
                value={form.time}
                onChange={handleFormChange}
                placeholder="--:-- --"
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 disabled:bg-gray-300"
            >
              {loading ? "Searching..." : "🔎 Search Rides"}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p>Loading results...</p>}
        {!loading && rides.length === 0 && !error && (
          <p>No rides found. Try adjusting your search.</p>
        )}
        {rides.map((ride) => (
          <RideResultCard key={ride._id} ride={ride} />
        ))}
      </section>
    </div>
  );
}

function RideResultCard({ ride }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold capitalize">
              {ride.from} → {ride.to}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(ride.departureDateTime).toLocaleDateString()} at {new Date(ride.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span>{ride.availableSeats} seats available</span>
              <span>•</span>
              <span>{ride.vehicle}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${ride.pricePerSeat.toFixed(2)}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <img src={ride.driver.avatar || '/default-avatar.png'} alt={ride.driver.name} className="h-10 w-10 rounded-full bg-gray-200 object-cover" />
            <div>
              <p className="font-medium text-gray-900">{ride.driver.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{ride.driver.rating?.average.toFixed(1) || 'New'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300">
              Book This Ride
            </button>
            <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4" />
              Message
            </button>
            <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1 text-sm">
              <Phone className="h-4 w-4" />
              Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
