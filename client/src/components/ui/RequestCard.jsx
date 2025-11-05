import { useState } from "react";
import {
  Star,
  MessageSquare,
  Check,
  X,
  Calendar,
  Clock,
  MapPin,
  User,
} from "lucide-react";

export default function RequestCard({ request, onAccept, onDecline }) {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [driverResponse, setDriverResponse] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept(request._id, driverResponse);
      setShowActions(false);
      setDriverResponse("");
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await onDecline(request._id, driverResponse);
      setShowActions(false);
      setDriverResponse("");
    } catch (error) {
      console.error("Error declining request:", error);
    } finally {
      setLoading(false);
    }
  };

  const trimLocation = (location) => {
    if (!location) return "";
    return location.split(",")[0].trim();
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    declined: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {trimLocation(request.ride?.from || request.rideInfo?.from)} →{" "}
              {trimLocation(request.ride?.to || request.rideInfo?.to)}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                statusColors[request.status] || statusColors.pending
              }`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(
                request.ride?.date || request.rideInfo?.date
              ).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {request.ride?.time || request.rideInfo?.time}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {request.seatsRequested} seat
              {request.seatsRequested > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ₹
            {(
              (request.ride?.pricePerSeat ||
                request.rideInfo?.pricePerSeat ||
                0) * request.seatsRequested
            ).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">total payment</p>
        </div>
      </div>

      {/* Passenger Info */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            src={request.passenger?.avatar || "/default-avatar.png"}
            alt={request.passenger?.name.split(" ")[0] || "Passenger"}
            className="h-10 w-10 rounded-full bg-gray-200 object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">
              {request.passenger?.name}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {request.passenger?.rating?.average?.toFixed(1) || "New"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">{request.passenger?.email}</p>
          {request.passenger?.phone && (
            <p className="text-sm text-gray-600">{request.passenger?.phone}</p>
          )}
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <span className="font-medium text-blue-900">
                Passenger Message:{" "}
              </span>
              <span className="text-blue-800">"{request.message}"</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {request.status === "pending" && (
        <div className="space-y-3">
          {!showActions ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowActions(true)}
                className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 font-medium"
              >
                Respond to Request
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
                  <Check className="h-4 w-4" />
                  {loading ? "Accepting..." : "Accept"}
                </button>

                <button
                  onClick={handleDecline}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {loading ? "Declining..." : "Decline"}
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
      {request.driverResponse && request.status !== "pending" && (
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-start gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <span className="font-medium text-green-900">
                Your Response:{" "}
              </span>
              <span className="text-green-800">"{request.driverResponse}"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
