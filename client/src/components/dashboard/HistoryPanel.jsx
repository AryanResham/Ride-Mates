import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, Receipt, Download } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

export default function HistoryPanel() {
  const [activeTab, setActiveTab] = useState("history");
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rideHistory, setRideHistory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        // Correct backend endpoint is /api/rider/bookings
        const token = user?.accessToken || user?.token;
        const res = await api.get("/api/rider/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRideHistory(res.data.bookings || res.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch ride history."
        );
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const filteredHistory = rideHistory.filter((ride) => {
    if (filter === "rated" && !ride.ratings?.passengerRatedDriver) return false;
    if (filter === "unrated" && ride.ratings?.passengerRatedDriver)
      return false;
    return true;
  });

  const totalSpent = rideHistory.reduce(
    (sum, ride) => sum + (ride.totalPrice || 0),
    0
  );
  const totalRides = rideHistory.length;
  const averageRating = rideHistory
    .filter((ride) => ride.ratings?.passengerRating)
    .reduce(
      (sum, ride, _, arr) => sum + ride.ratings.passengerRating / arr.length,
      0
    );

  return (
    <>
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-5 sm:p-6 md:p-8 pt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ride History
                </h2>
                <p className="text-gray-500 mt-1">
                  View your past rides and download receipts
                </p>
              </div>

              <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export History
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900">
                  {totalRides}
                </h3>
                <p className="text-sm text-blue-600">Total Rides</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900">
                  ₹{totalSpent}
                </h3>
                <p className="text-sm text-green-600">Total Spent</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900">
                  {averageRating ? averageRating.toFixed(1) : "N/A"}
                </h3>
                <p className="text-sm text-yellow-600">Average Rating Given</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex gap-2">
                <FilterButton
                  label="All Rides"
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                />
                <FilterButton
                  label="Rated"
                  active={filter === "rated"}
                  onClick={() => setFilter("rated")}
                />
                <FilterButton
                  label="Unrated"
                  active={filter === "unrated"}
                  onClick={() => setFilter("unrated")}
                  count={
                    rideHistory.filter((r) => !r.ratings?.passengerRatedDriver)
                      .length
                  }
                />
              </div>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>

            {/* History List */}
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                <p className="mt-2 text-gray-600">
                  Loading your ride history...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-gray-500">
                      {filter === "all"
                        ? "You haven't taken any rides yet."
                        : `No ${filter} rides found.`}
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((ride) => (
                    <HistoryCard key={ride._id || ride.id} ride={ride} />
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function HistoryCard({ ride }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {ride.rideDetails?.from.split(",")[0].charAt(0).toUpperCase() +
              ride.rideDetails?.from.split(",")[0].slice(1)}{" "}
            →{" "}
            {ride.rideDetails?.to.split(",")[0].charAt(0).toUpperCase() +
              ride.rideDetails?.to.split(",")[0].slice(1)}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {ride.rideDetails?.date.split("T")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {ride.rideDetails?.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {ride.rideDetails?.distance} • {ride.rideDetails?.duration}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">₹{ride.totalPrice}</p>
          <p className="text-sm text-gray-500">
            {ride.seatsBooked} seat{ride.seatsBooked > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Driver Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{ride.driver.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                {console.log(ride.driver.rating)}
                <span>{ride.driver.rating?.average || "N/A"}</span>
              </div>
              <span>•</span>
              <span>{ride.driver.vehicle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {ride.driverRated ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              <Star className="h-3 w-3 fill-current" />
              <span>Rated {ride.userRating}/5</span>
            </div>
          ) : (
            <button className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-medium hover:bg-yellow-300 transition">
              Rate Driver
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Booking ID: {ride.bookingId}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          <button className="px-3 py-1 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-1">
            <Receipt className="h-3 w-3" />
            Receipt
          </button>
          <button className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition text-sm font-medium">
            Book Again
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Pickup Time</p>
              <p className="font-medium">
                {ride.rideDetails?.date.split("T")[0]} at{" "}
                {ride.rideDetails?.time}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">{ride.rideDetails?.duration}</p>
            </div>
            <div>
              <p className="text-gray-500">Distance</p>
              <p className="font-medium">{ride.rideDetails?.distance}</p>
            </div>
            <div>
              <p className="text-gray-500">Price per Seat</p>
              <p className="font-medium">
                ₹{(ride.totalPrice / ride.seatsBooked).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-yellow-400 text-gray-900"
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
      {count && (
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-200 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
