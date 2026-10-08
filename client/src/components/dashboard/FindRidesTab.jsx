import { useCallback, useEffect, useState } from "react";
import { MoveRight, Phone, Star, X, Calendar, Clock, Users, Info, RotateCcw } from "lucide-react";
import { Field, Input } from "../ui/FormUi";
import Geocoder from "../ui/Geocoder";
import BookingModal from "../ui/BookingModal";
import api from "../../utils/api";
import Modal from "../ui/Modal";
import { shortCity } from "../../utils/cities";

export default function FindRidesTab({ onRequested }) {
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [form, setForm] = useState({ date: "", time: "" });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Show every upcoming ride until the passenger narrows it down.
  const loadAllRides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/rider/rides");
      setRides(data || []);
      setSearched(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllRides();
  }, [loadAllRides]);

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      setError("Pick a starting city and a destination.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice("");
    try {
      const { data } = await api.post("/api/rider/rides/search", {
        fromLocation: { type: "Point", coordinates: fromLocation.center },
        toLocation: { type: "Point", coordinates: toLocation.center },
        date: form.date || undefined,
        time: form.time || undefined,
      });
      setRides(data || []);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setFromLocation(null);
    setToLocation(null);
    setForm({ date: "", time: "" });
    loadAllRides();
  };

  const handleRequestSent = () => {
    setNotice("Request sent! The driver will see it in their Requests tab.");
    loadAllRides();
    onRequested?.();
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 sm:p-6 md:p-8 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Find a Ride</h2>
          <p className="text-sm text-gray-500 mb-4">Choose a route. Date and time are optional.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="From">
              <Geocoder onResult={setFromLocation} value={fromLocation} placeholder="Starting city" />
            </Field>
            <Field label="To">
              <Geocoder onResult={setToLocation} value={toLocation} placeholder="Destination" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Date (optional)">
              <Input type="date" name="date" value={form.date} onChange={handleFormChange} />
            </Field>
            <Field label="Time (optional, ±8 hours)">
              <Input type="time" name="time" value={form.time} onChange={handleFormChange} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 disabled:bg-gray-300"
            >
              {loading ? "Searching..." : "🔎 Search Rides"}
            </button>
            {searched && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" /> Show all rides
              </button>
            )}
          </div>

          {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          {notice && <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">{notice}</div>}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-gray-600">
            {searched ? "Matching rides" : "All upcoming rides"}
            {!loading && <span className="text-gray-400"> · {rides.length}</span>}
          </h3>
        </div>

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching for rides...</p>
          </div>
        )}
        {!loading && rides.length === 0 && !error && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <Info className="h-8 w-8 text-gray-300 mx-auto" />
            <p className="mt-2 text-gray-600 font-medium">No rides on this route yet.</p>
            <p className="text-sm text-gray-500">Try another city pair, or clear the date to widen the search.</p>
          </div>
        )}
        {!loading &&
          rides.map((ride) => (
            <RideResultCard
              key={ride._id}
              ride={ride}
              onBookRide={setSelectedRide}
              onCallDriver={setSelectedDriver}
            />
          ))}
      </section>

      <BookingModal
        isOpen={Boolean(selectedRide)}
        onClose={() => setSelectedRide(null)}
        ride={selectedRide}
        onSuccess={handleRequestSent}
      />

      <CallDriverModal isOpen={Boolean(selectedDriver)} onClose={() => setSelectedDriver(null)} driver={selectedDriver} />
    </div>
  );
}

function RideResultCard({ ride, onBookRide, onCallDriver }) {
  const departure = new Date(ride.departureDateTime);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 flex-wrap">
              {shortCity(ride.from)} <MoveRight className="inline-block w-5 h-4 text-gray-400" /> {shortCity(ride.to)}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {departure.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {ride.availableSeats} seat{ride.availableSeats === 1 ? "" : "s"} left
              </span>
              {ride.duration && <span>{ride.distance} · {ride.duration}</span>}
            </div>
            {ride.notes && <p className="mt-2 text-sm text-gray-600 italic">“{ride.notes}”</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-gray-900">₹{ride.pricePerSeat}</p>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={ride.driver?.avatar || "/default-avatar.svg"}
              alt={ride.driver?.name}
              className="h-10 w-10 rounded-full bg-gray-200 object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">{ride.driver?.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{ride.driver?.rating?.average ? ride.driver.rating.average.toFixed(1) : "New"}</span>
                <span className="text-gray-400">· {ride.vehicle}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookRide(ride)}
              className="px-3 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300"
            >
              Request Seat
            </button>
            <button
              onClick={() => onCallDriver(ride.driver)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center gap-1 text-sm"
            >
              <Phone className="h-4 w-4" />
              Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallDriverModal({ isOpen, onClose, driver }) {
  if (!isOpen || !driver) return null;

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="call-driver-modal-title">
      <div className="bg-white rounded-2xl p-8 w-[min(24rem,92vw)]">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center">
          <img
            src={driver.avatar || "/default-avatar.svg"}
            alt={driver.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 object-cover"
          />
          <h2 id="call-driver-modal-title" className="text-2xl font-bold text-gray-900">
            {driver.name}
          </h2>
          <p className="text-2xl font-bold text-gray-800 mt-4 tracking-wider">{driver.phone}</p>
          <p className="text-xs text-gray-500 mt-1">Demo number, not a real contact.</p>
          <button onClick={onClose} className="mt-6 px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
