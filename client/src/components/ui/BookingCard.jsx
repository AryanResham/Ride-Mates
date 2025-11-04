import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function BookingCard({ booking, onAccept, onReject }) {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [driverResponse, setDriverResponse] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept(booking._id, driverResponse);
      setShowActions(false);
      setDriverResponse("");
    } catch (error) {
      console.error("Error accepting booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(booking._id, driverResponse);
      setShowActions(false);
      setDriverResponse("");
    } catch (error) {
      console.error("Error rejecting booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const trimLocation = (location) => {
    if (!location) return "";
    return location.split(",")[0].trim();
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {trimLocation(booking.rideDetails?.from)} →{" "}
              {trimLocation(booking.rideDetails?.to)}
            </h3>
            {getStatusBadge(booking.status)}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(booking.rideDetails?.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {booking.rideDetails?.time}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {booking.seatsBooked} seat{booking.seatsBooked > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${booking.totalPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">total payment</p>
        </div>
      </div>

      {/* Passenger Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            src={booking.passenger?.avatar || "/default-avatar.png"}
            alt={booking.passenger?.name || "Passenger"}
            className="h-10 w-10 rounded-full bg-gray-200 object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">
              {booking.passenger?.name}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {booking.passenger?.rating?.average?.toFixed(1) || "New"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">{booking.passenger?.email}</p>
          {booking.passenger?.phone && (
            <p className="text-sm text-gray-600">{booking.passenger?.phone}</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {(booking.pickupPoint || booking.dropPoint || booking.message) && (
        <div className="space-y-2">
          {booking.pickupPoint && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Pickup: </span>
                <span className="text-gray-600">{booking.pickupPoint}</span>
              </div>
            </div>
          )}

          {booking.dropPoint && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Drop: </span>
                <span className="text-gray-600">{booking.dropPoint}</span>
              </div>
            </div>
          )}

          {booking.message && (
            <div className="flex items-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Message: </span>
                <span className="text-gray-600">"{booking.message}"</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {booking.status === "pending" && (
        <div className="space-y-3">
          {!showActions ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowActions(true)}
                className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 font-medium"
              >
                Respond to Booking
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (Optional)
                </label>
                <textarea
                  value={driverResponse}
                  onChange={(e) => setDriverResponse(e.target.value)}
                  placeholder="Add a message for the passenger..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {loading ? "Accepting..." : "Accept"}
                </button>

                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  {loading ? "Rejecting..." : "Reject"}
                </button>

                <button
                  onClick={() => {
                    setShowActions(false);
                    setDriverResponse("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Driver Response Display */}
      {booking.driverResponse && booking.status !== "pending" && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <span className="font-medium text-blue-900">Your Response: </span>
              <span className="text-blue-800">"{booking.driverResponse}"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
