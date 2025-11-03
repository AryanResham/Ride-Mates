import { useState } from "react";
import { Calendar, Clock, MapPin, Star, X } from "lucide-react";

export default function MyBookingsTab() {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([
    // {
    //   id: 11,
    //   from: "Downtown",
    //   to: "Airport",
    //   date: "2024-01-15",
    //   time: "14:30",
    //   price: 25,
    //   seats: 1,
    //   status: "upcoming",
    //   driver: { name: "John Smith", rating: 4.8 },
    // },
    // {
    //   id: 12,
    //   from: "University",
    //   to: "Mall",
    //   date: "2024-01-16",
    //   time: "10:00",
    //   price: 15,
    //   seats: 1,
    //   status: "completed",
    //   driver: { name: "Emily Clark", rating: 4.7 },
    // },
  ]);

  const filtered = filterBookings(bookings, filter);

  const cancelBooking = (id) =>
    setBookings((list) => cancelBookingInList(list, id));

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === t.key
                ? "bg-yellow-400 text-gray-900"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-500">
                {filter === "all"
                  ? "You haven't made any bookings yet."
                  : `No ${filter} bookings found.`}
              </p>
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-900 font-semibold">
                      {b.from} → {b.to}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {b.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {b.seats} seat{b.seats > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(b.price)}
                    </p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.driver.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {b.driver.rating}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === "upcoming" ? (
                      <>
                        <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                          Message
                        </button>
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                        <button className="px-3 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300">
                          Reschedule
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                          Receipt
                        </button>
                        <button className="px-3 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300">
                          Book Again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function formatPrice(n) {
  return `$${Number(n).toString()}`;
}
function filterBookings(list, key) {
  if (key === "all") return list;
  return list.filter((b) => b.status === key);
}

function cancelBookingInList(list, id) {
  return list.filter((b) => b.id !== id);
}
