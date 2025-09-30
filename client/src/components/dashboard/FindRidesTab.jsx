import { useState } from "react";
import { Check, Filter, MessageSquare, Phone, Star, X } from "lucide-react";
import { Field, Input, Select, Textarea } from "../ui/FormUi";

export default function FindRidesTab() {
  const [form, setForm] = useState({ from: "", to: "", date: "", time: "" });
  const rides = [
    {
      id: 1,
      from: "Downtown",
      to: "Airport",
      date: "2024-01-15",
      time: "14:30",
      price: 25,
      driver: {
        name: "John Smith",
        rating: 4.8,
        rides: 127,
        car: "Honda Civic",
      },
      meta: { seats: "2/4 seats", duration: "45 min", car: "Honda Civic" },
    },
    {
      id: 2,
      from: "University",
      to: "Mall",
      date: "2024-01-16",
      time: "10:00",
      price: 15,
      driver: {
        name: "Emily Clark",
        rating: 4.7,
        rides: 89,
        car: "Toyota Camry",
      },
      meta: { seats: "1/3 seats", duration: "25 min", car: "Toyota Camry" },
    },
  ];

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      {/* Search Card */}
      <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-5 sm:p-6 md:p-8 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <button className="px-4 py-2 rounded-xl bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300">
              Find Rides
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">
              My Bookings
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">
              Profile
            </button>
          </div>

          <p className="text-gray-500 mb-4">
            Search for available rides in your area
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="From">
              <Input
                name="from"
                value={form.from}
                onChange={handle}
                placeholder="Starting location"
              />
            </Field>
            <Field label="To">
              <Input
                name="to"
                value={form.to}
                onChange={handle}
                placeholder="Destination"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Date">
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handle}
                placeholder="dd-mm-yyyy"
              />
            </Field>
            <Field label="Time">
              <Input
                type="time"
                name="time"
                value={form.time}
                onChange={handle}
                placeholder="--:-- --"
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300">
              🔎 Search Rides
            </button>
            <button className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="space-y-4">
        {rides.map((r) => (
          <RideResultCard key={r.id} ride={r} />
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
            <h3 className="text-gray-900 font-semibold">
              {ride.from} → {ride.to}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {ride.date} at {ride.time}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <span>{ride.meta.seats}</span>
              <span>•</span>
              <span>{ride.meta.duration}</span>
              <span>•</span>
              <span>{ride.meta.car}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${ride.price}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>

        {/* Driver Row */}
        <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium text-gray-900">{ride.driver.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{ride.driver.rating}</span>
                <span>•</span>
                <span>{ride.driver.rides} rides</span>
                <span>•</span>
                <span>{ride.driver.car}</span>
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
