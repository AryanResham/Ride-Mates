import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import BookingCard from "../ui/BookingCard";
import api from "../../utils/api";

export default function BookingsTab() {
  const { getIdToken } = useAuth();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getIdToken();
      const response = await api.get("/api/driver/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId, driverResponse) => {
    try {
      const token = await getIdToken();
      const response = await api.put(
        `/api/driver/bookings/${bookingId}/accept`,
        { driverResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh bookings list
      fetchBookings();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleRejectBooking = async (bookingId, driverResponse) => {
    try {
      const token = await getIdToken();
      const response = await api.put(
        `/api/driver/bookings/${bookingId}/reject`,
        { driverResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh bookings list
      fetchBookings();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const filterBookings = (list, key) => {
    if (key === "all") return list;

    const statusMap = {
      pending: ["pending"],
      confirmed: ["confirmed"],
      rejected: ["rejected"],
      completed: ["completed"],
    };

    const targetStatuses = statusMap[key];
    if (!targetStatuses) return list;

    return list.filter((b) => targetStatuses.includes(b.status));
  };

  const filtered = filterBookings(bookings, filter);

  // Count bookings by status
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { key: "all", label: "All Bookings" },
          {
            key: "pending",
            label: `Pending (${pendingCount})`,
            count: pendingCount,
          },
          {
            key: "confirmed",
            label: `Confirmed (${confirmedCount})`,
            count: confirmedCount,
          },
          { key: "rejected", label: "Rejected" },
          { key: "completed", label: "Completed" },
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
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-500">
                {filter === "all"
                  ? "No bookings found for your rides."
                  : `No ${filter} bookings found.`}
              </p>
              {filter === "pending" && (
                <p className="text-sm text-gray-400 mt-1">
                  Bookings will appear here when passengers book your rides.
                </p>
              )}
            </div>
          ) : (
            filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onAccept={handleAcceptBooking}
                onReject={handleRejectBooking}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
