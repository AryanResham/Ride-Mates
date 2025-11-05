import { useState } from "react";
import { X, MapPin, Calendar, Clock, Users, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "./Modal";
import api from "../../utils/api";

export default function BookingModal({ ride, isOpen, onClose, onSuccess }) {
  const { getIdToken } = useAuth();
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [message, setMessage] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !ride) return null;

  const totalPrice = ride.pricePerSeat * seatsRequested;

  const handleBooking = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getIdToken();
      const response = await api.post(
        "/api/rider/requests",
        {
          rideId: ride._id,
          seatsRequested,
          message:
            message.trim() ||
            `Pickup: ${pickupPoint.trim()}, Drop: ${dropPoint.trim()}`.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trimLocation = (location) => {
    if (!location) return "";
    return location.split(",")[0].trim();
  };

  return (
    <Modal open={isOpen} onClose={onClose} labelledBy="booking-modal-title">
      <div className="bg-white rounded-xl min-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 px-5 border-b border-gray-200">
          <h2
            id="booking-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Book Ride
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ride Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Trip Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {trimLocation(ride.from)} → {trimLocation(ride.to)}
                  </span>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(ride.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{ride.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Driver</h3>
              <div className="flex items-center gap-3">
                <img
                  src={ride.driver?.avatar || "/default-avatar.png"}
                  alt={ride.driver?.name || "Driver"}
                  className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {ride.driver?.name || "Driver"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {ride.driver?.rating?.average?.toFixed(1) || "New"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            {/* Seat Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Seats *
              </label>
              <select
                value={seatsRequested}
                onChange={(e) => setSeatsRequested(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {Array.from(
                  { length: ride.availableSeats },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num} seat{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Point */}
            {/* Drop Point */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Point (Optional)
                </label>
                <input
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  placeholder="Pickup location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop Point (Optional)
                </label>
                <input
                  type="text"
                  value={dropPoint}
                  onChange={(e) => setDropPoint(e.target.value)}
                  placeholder="Drop location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Driver (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any special requests or information for the driver..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <div className=" border-gray-200 flex justify-between font-medium">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 disabled:opacity-50 font-medium"
            >
              {loading ? "Sending Request..." : "Send Request"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
