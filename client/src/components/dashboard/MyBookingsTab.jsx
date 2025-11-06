import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, X, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { MoveRight } from "lucide-react";
import api from "../../utils/api";

export default function MyBookingsTab() {
  const { getIdToken } = useAuth();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getIdToken();
      const response = await api.get("/api/rider/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setRequests(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterRequests(requests, filter);

  const cancelRequest = async (id, reason = "Cancelled by passenger") => {
    try {
      const token = await getIdToken();
      const response = await api.delete(`/api/rider/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason },
      });

      // Refresh requests
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "accepted", label: "Accepted" },
          { key: "declined", label: "Declined" },
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
          <p className="mt-2 text-gray-600">Loading your requests...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-gray-500">
                {filter === "all"
                  ? "You haven't made any requests yet."
                  : `No ${filter} requests found.`}
              </p>
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900 font-semibold capitalize">
                        {trimLocation(r.ride?.from || r.rideInfo?.from)}{" "}
                        <MoveRight className="inline-block fill-black w-8 h-4" />{" "}
                        {trimLocation(r.ride?.to || r.rideInfo?.to)}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          r.ride?.date || r.rideInfo?.date
                        ).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {r.ride?.time || r.rideInfo?.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {r.seatsRequested} seat{r.seatsRequested > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">
                                    ₹
                                    {(
                                      (r.ride?.pricePerSeat ||
                                        r.rideInfo?.pricePerSeat ||
                                        0) * r.seatsRequested
                                    ).toFixed(2)}
                                  </p>                    <p className="text-xs text-gray-500">estimated total</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.driver?.avatar || "/default-avatar.png"}
                      alt={r.driver?.name || "Driver"}
                      className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {r.driver?.name || "Driver"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {r.driver?.rating?.average?.toFixed(1) || "New"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.status === "pending" && (
                      <button
                        onClick={() => cancelRequest(r._id)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancel Request
                      </button>
                    )}

                    {r.status === "accepted" && (
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Request Accepted
                        </p>
                        <p className="text-xs text-gray-500">
                          Your ride is confirmed!
                        </p>
                      </div>
                    )}

                    {r.status === "declined" && (
                      <div className="text-right">
                        <p className="text-sm text-red-600 font-medium">
                          ✗ Request Declined
                        </p>
                        {r.driverResponse && (
                          <p className="text-xs text-gray-500">
                            "{r.driverResponse}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Display */}
                {r.message && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-blue-900">
                          Your Message:{" "}
                        </span>
                        <span className="text-blue-800">"{r.message}"</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const trimLocation = (location) => {
  if (!location) return "";
  return location.split(",")[0].trim();
};

const getStatusBadge = (status) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    declined: "bg-red-100 text-red-800 border-red-200",
  };
  return statusStyles[status] || statusStyles.pending;
};

function filterRequests(list, key) {
  if (key === "all") return list;
  return list.filter((r) => r.status === key);
}
